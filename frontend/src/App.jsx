import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // SECURITY AUTHENTICATION STATES
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Master Data States
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [messages, setMessages] = useState([]);

  // SEVA.ORG DROPDOWN STATES (SCREENSHOT 92)
  const [activeDropdown, setActiveDropdown] = useState(null);

  // SEVA.ORG PRIVACY MODAL POPUP STATE (SCREENSHOT 90)
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true);

  // FEATURE STATES
  const [regionFilter, setRegionFilter] = useState('All');
  const [showInitialPopup, setShowInitialPopup] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReceiptData, setLastReceiptData] = useState(null);

  // Form Field Trackers
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('Nepal Mission');
  const [goalAmount, setGoalAmount] = useState('50000');

  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volTargetCampaign, setVolTargetCampaign] = useState('Nepal Eye Care Mission');

  const [donorName, setDonorName] = useState('');
  const [donateAmount, setDonateAmount] = useState('1000');
  const [payMethod, setPayMethod] = useState('Google Pay');
  const [targetDonationCampaign, setTargetDonationCampaign] = useState('General Fund');
  const [showModal, setShowModal] = useState(false);

  const [msgName, setMsgName] = useState('');
  const [msgEmail, setMsgEmail] = useState('');
  const [msgSub, setMsgSub] = useState('');
  const [msgText, setMsgText] = useState('');

  const fetchData = () => {
    fetch('http://localhost:5000/api/events/all').then(res => res.json()).then(d => { if(Array.isArray(d)) setEvents(d); });
    fetch('http://localhost:5000/api/events/volunteers/all').then(res => res.json()).then(d => { if(Array.isArray(d)) setVolunteers(d); });
    fetch('http://localhost:5000/api/events/donations/all').then(res => res.json()).then(d => { if(Array.isArray(d)) setDonations(d); });
    fetch('http://localhost:5000/api/events/messages/all').then(res => res.json()).then(d => { if(Array.isArray(d)) setMessages(d); });
  };

  useEffect(() => { 
    fetchData(); 
    const token = localStorage.getItem('adminToken');
    if(token === 'authenticated_seva_node') setIsAdminLoggedIn(true);
    
    // Check privacy consent cookie trace persistence
    const privacyConsent = localStorage.getItem('privacyAccepted');
    if(privacyConsent === 'true') setShowPrivacyBanner(false);
  }, []);

  // Handlers
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if(usernameInput === 'admin' && passwordInput === 'seva123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('adminToken', 'authenticated_seva_node');
      setShowLoginModal(false);
      setUsernameInput(''); setPasswordInput('');
      alert("🔒 Authorization Success: Welcome to Admin Console!");
    } else {
      alert("❌ Access Denied: Invalid Credentials Configuration!");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('adminToken');
    setActiveTab('home');
    alert("🔓 Sessions Terminated. Switched to Public Mode.");
  };

  const acceptPrivacy = () => {
    setShowPrivacyBanner(false);
    localStorage.setItem('privacyAccepted', 'true');
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/events/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description, date, location, goal: goalAmount }) })
    .then(() => { alert("Campaign Node Live!"); setTitle(''); setDescription(''); setDate(''); fetchData(); });
  };

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/events/volunteers/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: volName, email: volEmail, phone: volPhone, skills: volTargetCampaign }) })
    .then(res => res.json()).then(d => { alert(d.message); setVolName(''); setVolEmail(''); setVolPhone(''); fetchData(); });
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/events/messages/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: msgName, email: msgEmail, subject: msgSub, message: msgText }) })
    .then(res => res.json()).then(d => { alert(d.message); setMsgName(''); setMsgEmail(''); setMsgSub(''); setMsgText(''); fetchData(); });
  };

  const deleteMessage = (id) => {
    fetch(`http://localhost:5000/api/events/messages/delete/${id}`, { method: 'DELETE' })
    .then(res => res.json()).then(d => { alert(d.message); fetchData(); });
  };

  const completePayment = () => {
    fetch('http://localhost:5000/api/events/donations/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ donorName, amount: donateAmount, paymentMethod: payMethod, campaignLink: targetDonationCampaign }) })
    .then(res => res.json()).then(d => {
        const receiptToken = "TXN_SEVA_" + Math.floor(100000 + Math.random() * 900000);
        setLastReceiptData({ name: donorName, amount: donateAmount, method: payMethod, token: receiptToken, campaign: targetDonationCampaign, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) });
        setDonorName(''); setShowModal(false); setShowReceipt(true); fetchData();
    });
  };

  const totalFunds = donations.reduce((sum, item) => sum + parseInt(item.amount || 0), 0);
  const livesImpacted = (donations.length * 4) + (events.length * 150) + 420;
  const filteredEvents = events.filter(e => regionFilter === 'All' || (e.location && e.location.toLowerCase().includes(regionFilter.toLowerCase())));
  const getCampaignRaisedAmount = (campTitle) => donations.filter(d => d.campaignLink === campTitle || (campTitle === "Nepal Eye Care Mission" && !d.campaignLink)).reduce((sum, d) => sum + parseInt(d.amount || 0), 0);

  return (
    <div style={{ background: '#f4f7f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ================= FEATURE 3: SEVA.ORG HOVER DROPDOWN NAVBAR (SCREENSHOT 92) ================= */}
      <header style={{ background: '#ffffff', padding: '15px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 15px rgba(0,0,0,0.06)', position: 'sticky', top: '0', zIndex: '1000' }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: '#8a1836', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => { setActiveTab('home'); setRegionFilter('All'); }}>
          <span style={{ color: '#8a1836', borderRight: '2px solid #ddd', paddingRight: '12px', marginRight: '10px' }}>seva</span>
          <span style={{ fontSize: '12px', color: '#666', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Transforming lives<br/>by restoring sight.</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', fontWeight: '700', fontSize: '15px', textTransform: 'uppercase' }}>
          
          {/* HOVER OPTION Node 1 */}
          <div 
            style={{ position: 'relative', padding: '10px 0', cursor: 'pointer', color: '#8a1836' }}
            onMouseEnter={() => setActiveDropdown('ourWork')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span onClick={() => setActiveTab('home')}>Our Work ▾</span>
            {activeDropdown === 'ourWork' && (
              <div style={{ position: 'absolute', top: '40px', left: '0', background: '#5a0f23', width: '200px', borderRadius: '4px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', padding: '10px 0', zIndex: '10000', textTransform: 'none' }}>
                <div onClick={() => { setActiveTab('home'); setRegionFilter('All'); }} style={{ padding: '10px 20px', color: '#fff', fontSize: '14px', fontWeight: '500' }} className="hoverItem">Why Sight?</div>
                <div onClick={() => { setActiveTab('home'); setRegionFilter('Nepal'); }} style={{ padding: '10px 20px', color: '#fff', fontSize: '14px', fontWeight: '500' }} className="hoverItem">Nepal Mission</div>
                <div onClick={() => { setActiveTab('home'); setRegionFilter('India'); }} style={{ padding: '10px 20px', color: '#fff', fontSize: '14px', fontWeight: '500' }} className="hoverItem">India Mission Hub</div>
                <div onClick={() => setActiveTab('home')} style={{ padding: '10px 20px', color: '#fff', fontSize: '14px', fontWeight: '500' }} className="hoverItem">Research & Stories</div>
              </div>
            )}
          </div>

          {/* HOVER OPTION Node 2 */}
          <div 
            style={{ position: 'relative', padding: '10px 0', cursor: 'pointer', color: '#8a1836' }}
            onMouseEnter={() => setActiveDropdown('getInvolved')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span>Get Involved ▾</span>
            {activeDropdown === 'getInvolved' && (
              <div style={{ position: 'absolute', top: '40px', left: '0', background: '#5a0f23', width: '220px', borderRadius: '4px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', padding: '10px 0', zIndex: '10000', textTransform: 'none' }}>
                <div onClick={() => setActiveTab('volunteer')} style={{ padding: '10px 20px', color: '#fff', fontSize: '14px', fontWeight: '500' }} className="hoverItem">Become a Volunteer</div>
                <div onClick={() => setActiveTab('contact')} style={{ padding: '10px 20px', color: '#fff', fontSize: '14px', fontWeight: '500' }} className="hoverItem">Public Grievance Desk</div>
                {isAdminLoggedIn && <div onClick={() => setActiveTab('contact')} style={{ padding: '10px 20px', color: '#ffb703', fontSize: '14px', fontWeight: '700' }} className="hoverItem">🔒 Secure Admin Inbox</div>}
              </div>
            )}
          </div>

          <span onClick={() => setActiveTab('contact')} style={{ cursor: 'pointer', color: '#8a1836' }}>Contact Us</span>

          <button onClick={() => setActiveTab('donate')} style={{ background: '#b51a44', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>GIFTS OF SIGHT</button>
          <button onClick={() => setActiveTab('donate')} style={{ background: '#e65c00', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>DONATE</button>

          {isAdminLoggedIn ? (
            <button onClick={handleAdminLogout} style={{ background: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Logout 🔓</button>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={{ background: '#8a1836', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Admin Panel 🔒</button>
          )}
        </nav>
      </header>

      <div style={{ flex: '1' }}>
        {/* ================= TAB 1: HOME LAYOUT ================= */}
        {activeTab === 'home' && (
          <div>
            <div style={{ background: 'linear-gradient(rgba(0,0,0,0.25), rgba(90,15,35,0.85)), url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470") center/cover', padding: '110px 60px', color: 'white' }}>
              <h1 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '15px' }}>Bringing the World into Focus for Nepali Children in Need</h1>
              <p style={{ fontSize: '18px', maxW: '750px', lineHeight: '1.6', marginBottom: '35px', fontWeight: '300' }}>Hum MERN Stack architecture layers se diagnostic pipelines optimize karte hain, jisse transparent auditing ready rahe.</p>
              <button onClick={() => setActiveTab('donate')} style={{ background: '#ffb703', color: '#1b4332', fontSize: '16px', padding: '14px 35px', border: 'none', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}>Support Campaigns</button>
            </div>

            {/* IMPACT CORES */}
            <div style={{ padding: '40px 60px 0 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', borderLeft: '5px solid #ffb703' }}>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>TOTAL CAPITAL AUDITED</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#8a1836', margin: '5px 0' }}>₹ {totalFunds.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '12px', color: 'green' }}>● Settled tracking sync matrix</div>
              </div>
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', borderLeft: '5px solid #b51a44' }}>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>EYE CARE PROCEDURES EXECUTED</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#b51a44', margin: '5px 0' }}>{livesImpacted}+ Operations</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Nepal & India nodes aggregated</div>
              </div>
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', borderLeft: '5px solid #333' }}>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>ROSTER PERSONNEL STRENGTH</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#333', margin: '5px 0' }}>{volunteers.length} Active Deployed</div>
                <div style={{ fontSize: '12px', color: '#444' }}>Live schema architecture status</div>
              </div>
            </div>

            {/* MAIN OPERATIONS */}
            <div style={{ padding: '50px 60px', display: 'grid', gridTemplateColumns: isAdminLoggedIn ? '1fr 2fr' : '1fr', gap: '40px' }}>
              {isAdminLoggedIn && (
                <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #eee', height: 'fit-content' }}>
                  <h3 style={{ color: '#8a1836', margin: '0 0 5px 0' }}>📢 Launch New Program</h3>
                  <p style={{ fontSize: '11px', color: 'red', marginBottom: '15px' }}>🔒 AUTHORIZED SECURE LEVEL CONSOLE NODE</p>
                  <form onSubmit={handleEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} placeholder="Program/Campaign Title" />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }} placeholder="Mission configurations..." />
                    <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} placeholder="Temporal Duration Window" />
                    <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} placeholder="Financial Goal Target (₹)" />
                    <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', background: 'white' }}>
                      <option value="Nepal Mission">Nepal Mission Hub</option>
                      <option value="India Mission">India Mission Hub</option>
                    </select>
                    <button type="submit" style={{ background: '#8a1836', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '700' }}>Publish Program Node</button>
                  </form>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#8a1836' }}>⚡ Selected Target Sector:</span>
                  <span style={{ padding: '6px 15px', background: '#8a1836', color: '#fff', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>{regionFilter} Hub Node Active</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {filteredEvents.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '20px' }}>
                      <h4 style={{ color: '#8a1836' }}>Nepal Eye Care Mission Node</h4>
                      <p style={{ fontSize: '13px', color: '#666', margin: '10px 0' }}>Himalayan remote clinics field mapping execution node setup.</p>
                      <div style={{ marginTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}><span>Raised: ₹25,000</span><span>Target: ₹50,000</span></div>
                        <div style={{ width: '100%', height: '8px', background: '#eee', borderRadius: '10px', overflow: 'hidden', marginTop: '5px' }}><div style={{ width: '50%', height: '100%', background: '#ffb703' }}></div></div>
                      </div>
                    </div>
                  ) : (
                    filteredEvents.map((e) => {
                      const currentGoal = parseInt(e.goal || 50000);
                      const currentRaised = getCampaignRaisedAmount(e.title);
                      const calcPercentage = Math.min(100, Math.floor((currentRaised / currentGoal) * 100));
                      return (
                        <div key={e._id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '20px' }}>
                          <span style={{ fontSize: '11px', background: '#fce4d6', color: '#c65911', padding: '3px 8px', borderRadius: '10px', fontWeight: '700' }}>SIGHT LOGS</span>
                          <h4 style={{ color: '#8a1836', margin: '10px 0 8px 0', fontSize: '18px' }}>{e.title}</h4>
                          <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5' }}>{e.description}</p>
                          <div style={{ marginTop: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}><span>Raised: ₹{currentRaised}</span><span>Target: ₹{currentGoal}</span></div>
                            <div style={{ width: '100%', height: '8px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden', marginTop: '5px' }}><div style={{ width: `${calcPercentage}%`, height: '100%', background: '#e65c00' }}></div></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VOLUNTEERS ================= */}
        {activeTab === 'volunteer' && (
          <div style={{ padding: '50px 60px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
            <div style={{ background: '#fce4d6', padding: '30px', borderRadius: '12px', height: 'fit-content' }}>
              <h3 style={{ color: '#8a1836', marginTop: '0' }}>🤝 Personnel Roster Onboarding</h3>
              <form onSubmit={handleVolunteerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                <input type="text" placeholder="Identity Label Full Name" value={volName} onChange={(e) => setVolName(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="email" placeholder="Communication Email" value={volEmail} onChange={(e) => setVolEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="tel" placeholder="Contact Mobile Sequence" value={volPhone} onChange={(e) => setVolPhone(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <select value={volTargetCampaign} onChange={(e) => setVolTargetCampaign(e.target.value)} style={{ padding: '12px', borderRadius: '6px', background: 'white', border: '1px solid #ccc' }}>
                  <option value="Nepal Eye Care Mission">Nepal Eye Care Mission Hub</option>
                  <option value="India Diagnostics Wing">India Diagnostics Wing Hub</option>
                </select>
                <button type="submit" style={{ background: '#8a1836', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '700' }}>Enroll Into Deployment Array</button>
              </form>
            </div>
            <div>
              <h3 style={{ color: '#8a1836', marginBottom: '20px' }}>Active Staff Mapping Logs</h3>
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#8a1836', color: 'white' }}>
                      <th style={{ padding: '15px' }}>Name</th>
                      <th style={{ padding: '15px' }}>Email Routing</th>
                      <th style={{ padding: '15px' }}>Phone Check</th>
                      <th style={{ padding: '15px' }}>Assigned Allocation Node</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteers.map(v => (
                      <tr key={v._id} style={{ borderBottom: '1px solid #eee', fontSize: '14px' }}>
                        <td style={{ padding: '15px', fontWeight: '700' }}>{v.name}</td>
                        <td style={{ padding: '15px' }}>{v.email}</td>
                        <td style={{ padding: '15px' }}>{v.phone}</td>
                        <td style={{ padding: '15px' }}><span style={{ background: '#fce4d6', color: '#c65911', padding: '5px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: '700' }}>{v.skills}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CONTACT FORM & ADMIN INBOX ================= */}
        {activeTab === 'contact' && (
          <div style={{ padding: '50px 60px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
            <div style={{ background: '#f5eef0', padding: '30px', borderRadius: '12px', height: 'fit-content' }}>
              <h3 style={{ color: '#8a1836', marginTop: '0' }}>📬 Public Query Node</h3>
              <form onSubmit={handleMessageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                <input type="text" placeholder="Identity Label" value={msgName} onChange={(e) => setMsgName(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
                <input type="email" placeholder="Email Box Node" value={msgEmail} onChange={(e) => setMsgEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
                <input type="text" placeholder="Subject Target Area" value={msgSub} onChange={(e) => setMsgSub(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
                <textarea placeholder="Write descriptive details..." value={msgText} onChange={(e) => setMsgText(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }} />
                <button type="submit" style={{ background: '#8a1836', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '700' }}>Transmit Token</button>
              </form>
            </div>
            <div>
              <h3 style={{ color: '#8a1836', marginBottom: '20px' }}>📥 Central Secure Administration Inbox</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isAdminLoggedIn ? (
                  <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', padding: '25px', borderRadius: '12px', textAlign: 'center', fontWeight: '600' }}>
                    🔒 SECURITY BLOCK ACCESS ALERT: Admin authorization required to fetch client grievance data lines log rows.
                  </div>
                ) : (
                  messages.map(m => (
                    <div key={m._id} style={{ background: 'white', border: '1px solid #ddd', padding: '20px', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ background: '#fce4d6', color: '#c65911', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>{m.subject}</span>
                        <span style={{ fontSize: '12px', color: '#888' }}>{m.date}</span>
                      </div>
                      <h4 style={{ margin: '8px 0 5px 0', color: '#8a1836' }}>Sender: {m.name} <span style={{ fontWeight: '400', fontSize: '13px', color: '#666' }}>({m.email})</span></h4>
                      <p style={{ fontSize: '14px', color: '#444', margin: '10px 0', background: '#fdfdfd', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #8a1836', lineHeight: '1.5' }}>{m.message}</p>
                      <button onClick={() => deleteMessage(m._id)} style={{ background: '#c00000', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', float: 'right' }}>Mark Resolved ×</button>
                      <div style={{ clear: 'both' }}></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: DONATIONS ================= */}
        {activeTab === 'donate' && (
          <div style={{ padding: '50px 60px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
            <div style={{ background: '#fffcf2', padding: '30px', borderRadius: '12px', border: '1px solid #fed9b7', height: 'fit-content' }}>
              <h3 style={{ color: '#b55d00', marginTop: '0' }}>❤️ Secure Remittance Gate</h3>
              <form onSubmit={(e) => { e.preventDefault(); setShowModal(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '15px' }}>
                <input type="text" placeholder="Donor Account Name Signature" value={donorName} onChange={(e) => setDonorName(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #fed9b7' }} />
                <select value={targetDonationCampaign} onChange={(e) => setTargetDonationCampaign(e.target.value)} style={{ padding: '12px', borderRadius: '6px', background: 'white', border: '1px solid #ccc' }}>
                  <option value="General Fund">General Global Cause Fund</option>
                  {events.map(ev => <option key={ev._id} value={ev.title}>{ev.title}</option>)}
                </select>
                <select value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} style={{ padding: '12px', borderRadius: '6px', background: 'white', border: '1px solid #ccc' }}>
                  <option value="500">₹ 500 (Diagnostic Eye Drops Supply Box)</option>
                  <option value="1000">₹ 1,000 (Clinical Screening Pack)</option>
                  <option value="5000">₹ 5,000 (Pediatric Cataract Surgery)</option>
                </select>
                <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} style={{ padding: '12px', borderRadius: '6px', background: 'white', border: '1px solid #ccc' }}>
                  <option value="Google Pay">Google Pay (UPI Dynamic Merchant Router)</option>
                  <option value="PhonePe">PhonePe API Processing</option>
                  <option value="Credit / Debit Card">Secured Bank Visa/MasterCard</option>
                </select>
                <button type="submit" style={{ background: '#e65c00', color: 'white', padding: '14px', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '16px' }}>Proceed to Gateway Escrow</button>
              </form>
            </div>
            <div>
              <h3 style={{ color: '#e65c00', marginBottom: '20px' }}>Remittance Transparency Audit Trail</h3>
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#e65c00', color: 'white' }}>
                      <th style={{ padding: '15px' }}>Donor Signature Trace</th>
                      <th style={{ padding: '15px' }}>Financial Volume</th>
                      <th style={{ padding: '15px' }}>Linked Destination Node</th>
                      <th style={{ padding: '15px' }}>Audit Token</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d._id} style={{ borderBottom: '1px solid #eee', fontSize: '14px' }}>
                        <td style={{ padding: '15px', fontWeight: '700' }}>{d.donorName}</td>
                        <td style={{ padding: '15px', color: '#e65c00', fontWeight: '700' }}>₹ {parseInt(d.amount).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '15px', color: '#666' }}>{d.campaignLink || "Nepal Eye Care Mission"}</td>
                        <td style={{ padding: '15px' }}><span style={{ color: '#2d6a4f', background: '#d8f3dc', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>✓ SETTLED</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= FEATURE 2: SEVA.ORG MULTI-COLUMN COMPACT MASTER FOOTER (SCREENSHOT 91) ================= */}
      <footer style={{ background: '#5a0f23', color: '#ffffff', padding: '60px 80px 30px 80px', borderTop: '4px solid #ffb703', marginTop: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          {/* Column 1: Newsletter Frame */}
          <div>
            <h4 style={{ color: '#ffb703', marginBottom: '15px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Don't miss out on more news.</h4>
            <p style={{ fontSize: '13px', color: '#f0f0f0', marginBottom: '15px', lineHeight: '1.5' }}>Sign up today and get life transforming stories and event announcements.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="First Name" style={{ padding: '10px', borderRadius: '4px', border: 'none', background: '#ffffff', fontSize: '14px' }} />
              <input type="email" placeholder="Your Email" style={{ padding: '10px', borderRadius: '4px', border: 'none', background: '#ffffff', fontSize: '14px' }} />
              <button style={{ background: '#e65c00', color: 'white', border: 'none', padding: '11px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', fontSize: '13px' }}>Subscribe Now</button>
            </div>
          </div>

          {/* Column 2: Quick Quick-links */}
          <div>
            <h4 style={{ color: '#ffb703', marginBottom: '15px', fontSize: '16px', textTransform: 'uppercase' }}>Our Core Footprint</h4>
            <ul style={{ listStyle: 'none', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#f1f1f1' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setRegionFilter('Nepal'); }}>● Kathmandu Medical Sector</li>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setRegionFilter('India'); }}>● Varanasi Clinical Node Hub</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('volunteer')}>● Active Ground Roster Deployment</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('contact')}>● Central Transparency Desk</li>
            </ul>
          </div>

          {/* Column 3: Badges Credentials Frame */}
          <div>
            <h4 style={{ color: '#ffb703', marginBottom: '15px', fontSize: '16px', textTransform: 'uppercase' }}>Accreditations & Trust</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', opacity: '0.9' }}>
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>MILLION LIVES COLLECTIVE</span>
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>HOLIDAY IMPACT PRIZE</span>
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>CHARITY NAVIGATOR FOUR-STAR</span>
            </div>
          </div>

        </div>

        {/* Bottom Metadata Layer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: '#ddd', lineHeight: '1.6' }}>
          <p>Seva Foundation 1786 Fifth Street Berkeley, CA 94710 | Local Delivery Nodes Map Node India Pipeline Configured.</p>
          <p style={{ marginTop: '5px', color: '#ffb703', fontWeight: '500' }}>© 2026 Seva Foundation. All rights reserved. [ MERN Secure Sandbox Stack Prototype Node ]</p>
        </div>
      </footer>

      {/* ================= FEATURE 1: SEVA.ORG EXACT PRIVACY COOKIE BANNER (SCREENSHOT 90) ================= */}
      {showPrivacyBanner && (
        <div style={{ position: 'fixed', bottom: '25px', left: '25px', maxWidth: '360px', background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 10px 35px rgba(0,0,0,0.15)', borderLeft: '6px solid #8a1836', zIndex: '999999', animation: 'slideUp 0.4s ease' }}>
          <h4 style={{ color: '#8a1836', fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>We value your privacy</h4>
          <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.5', marginBottom: '20px' }}>
            We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={acceptPrivacy} style={{ flex: '1', padding: '8px 12px', border: '1px solid #8a1836', background: 'transparent', color: '#8a1836', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Customise</button>
            <button onClick={acceptPrivacy} style={{ flex: '1', padding: '8px 12px', border: 'none', background: '#5a0f23', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Reject All</button>
            <button onClick={acceptPrivacy} style={{ flex: '2', padding: '8px 12px', border: 'none', background: '#8a1836', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Accept All</button>
          </div>
        </div>
      )}

      {/* SYSTEM MODAL INTERFACES NODES */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '99999', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', maxWidth: '380px', width: '90%', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#8a1836', fontSize: '22px', fontWeight: '800', textAlign: 'center', marginBottom: '20px' }}>🔒 Admin Console Login</h3>
            <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Security Username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="password" placeholder="Security Password Key" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: '1', padding: '12px', border: '1px solid #ccc', background: '#fff', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: '2', padding: '12px', border: 'none', background: '#8a1836', color: 'white', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Authorize</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL DISPATCH MARKETING PROMO POPUP */}
      {showInitialPopup && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: '#ffffff', maxWidth: '500px', width: '95%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <div style={{ height: '180px', background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600") center/cover' }}></div>
            <div style={{ padding: '35px 30px' }}>
              <span style={{ background: '#ffb703', color: '#8a1836', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>GLOBAL URGENT APPEAL 🚨</span>
              <h3 style={{ color: '#8a1836', fontSize: '24px', fontWeight: '800', margin: '15px 0 10px 0', lineHeight: '1.3' }}>Sponsor Pediatric Vision Rehabilitation Today</h3>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '25px' }}>Aapka ek timely remittance direct children cataract micro-surgeries trigger karta hai.</p>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setShowInitialPopup(false)} style={{ flex: '1', padding: '12px', border: '1px solid #ddd', background: '#fff', borderRadius: '30px', fontWeight: '600', cursor: 'pointer' }}>Explore Site</button>
                <button onClick={() => { setShowInitialPopup(false); setActiveTab('donate'); }} style={{ flex: '2', padding: '12px', border: 'none', background: '#e65c00', color: '#fff', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}>Sponsor Surgery ❤️</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BANK SECURE PORTAL MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '999', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', maxWidth: '440px', width: '90%', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            <h3 style={{ color: '#8a1836', fontSize: '22px', fontWeight: '800' }}>🔒 Encryption Secure Core</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Remittance: <strong style={{ color: '#e65c00' }}>₹{donateAmount}</strong> via {payMethod}</p>
            <hr style={{ margin: '15px 0', border: '0.5px solid #eee' }} />
            {payMethod !== "Credit / Debit Card" ? (
              <div style={{ background: '#fff', padding: '10px', width: '170px', height: '170px', margin: '0 auto 15px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '12px' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=seva_ngo@mockbank%26pn=Seva%2520Global%2520Net%26am=${donateAmount}%26cu=INR`} alt="Seva QR" style={{ width: '150px', height: '150px' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                <input type="text" placeholder="16-Digit Full Card Sequence Number" maxLength="16" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" placeholder="MM/YY" maxLength="5" style={{ flex: '1', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }} />
                  <input type="password" placeholder="Secure CVV Token" maxLength="3" style={{ flex: '1', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }} />
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: '1', padding: '12px', border: '1px solid #ccc', background: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Abort</button>
              <button onClick={completePayment} style={{ flex: '2', padding: '12px', border: 'none', background: '#8a1836', color: 'white', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }}>Confirm Settle</button>
            </div>
          </div>
        </div>
      )}

      {/* FINANCIAL AUDIT LEDGER RECEIPT VOUCHER */}
      {showReceipt && lastReceiptData && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '99999', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#ffffff', width: '90%', maxWidth: '450px', borderRadius: '16px', padding: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', border: '2px solid #8a1836', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '30px', top: '25px', border: '3px dashed #2d6a4f', color: '#2d6a4f', textTransform: 'uppercase', padding: '5px 10px', fontSize: '12px', fontWeight: '800', borderRadius: '4px', transform: 'rotate(12deg)', opacity: '0.85' }}>✓ SEVA SEALED</div>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#8a1836' }}>🌱 SEVA GLOBAL FOUNDATION</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>Tax Exempt Audit Acknowledgement Certificate</div>
            </div>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div><span style={{ color: '#666' }}>Audit Reference Token:</span> <br /><strong style={{ fontFamily: 'monospace', color: '#8a1836' }}>{lastReceiptData.token}</strong></div>
              <hr style={{ border: '0.5px solid #eef2ef' }} />
              <div><span style={{ color: '#666' }}>Donor Contributor:</span> <br /><strong>{lastReceiptData.name}</strong></div>
              <div><span style={{ color: '#666' }}>Linked Target Campaign:</span> <br /><strong style={{ color: '#8a1836' }}>{lastReceiptData.campaign}</strong></div>
              <div><span style={{ color: '#666' }}>Remittance Volume Settled:</span> <br /><strong style={{ fontSize: '18px', color: '#e65c00' }}>₹ {parseInt(lastReceiptData.amount).toLocaleString('en-IN')}.00</strong></div>
              <div><span style={{ color: '#666' }}>Gateway Channel:</span> <br /><strong>{lastReceiptData.method} Node</strong></div>
              <div><span style={{ color: '#666' }}>Audit Timestamp Ledger:</span> <br /><strong>{lastReceiptData.date}</strong></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
              <button onClick={() => window.print()} style={{ flex: '1', background: '#ffb703', color: '#1b4332', padding: '12px', border: 'none', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}>Print Receipt 🖨️</button>
              <button onClick={() => setShowReceipt(false)} style={{ flex: '1', background: '#8a1836', color: 'white', padding: '12px', border: 'none', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' }}>Close Ledger</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;