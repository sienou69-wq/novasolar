import React, { useState, useEffect } from 'react';

export default function App() {
  // --- ÉTATS GLOBAUX ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  
  // Formulaire auth
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [countryCode, setCountryCode] = useState('+226');

  // Navigation interne client ('dashboard' | 'packages' | 'recharge' | 'withdraw' | 'network' | 'account')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Données utilisateur
  const [userBalance, setUserBalance] = useState(15000);
  const [dailyEarnings, setDailyEarnings] = useState(2232);
  const [activePackages, setActivePackages] = useState([
    { id: 1, name: 'Kit Résidentiel S2', price: 10000, daily: 2232, daysLeft: 85 }
  ]);

  // Recharge & Retrait
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');

  // Admin Demandes
  const [pendingRecharges, setPendingRecharges] = useState([
    { id: 'RCH-9812', user: '+226 70 12 34 56', amount: 10000, txId: 'OM9823741' }
  ]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([
    { id: 'WDR-4421', user: '+226 75 98 65 43', amount: 5000, phone: '+226 75 98 65 43' }
  ]);

  // Support Chat
  const [chatMessages, setChatMessages] = useState([
    { sender: 'support', text: 'Bonjour ! Bienvenue sur NovaSolar. Comment pouvons-nous vous aider aujourd’hui ?', time: '10:00' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // 10 Forfaits Solaires
  const packagesList = [
    { id: 1, name: 'Mini Panneau Solar', price: 2500, daily: 558, total: 55800, locked: false },
    { id: 2, name: 'Kit Résidentiel S1', price: 5000, daily: 1116, total: 111600, locked: false },
    { id: 3, name: 'Kit Résidentiel S2', price: 10000, daily: 2232, total: 223200, locked: false },
    { id: 4, name: 'Station Solaire Pro', price: 25000, daily: 5580, total: 558000, locked: false },
    { id: 5, name: 'Centrale Photovoltaïque', price: 50000, daily: 11160, total: 1116000, locked: false },
    { id: 6, name: 'Centrale Avancée X1', price: 100000, daily: 23000, total: 2300000, locked: true },
    { id: 7, name: 'Centrale Industrielle S6', price: 250000, daily: 60000, total: 6000000, locked: true },
    { id: 8, name: 'Ferme Solaire Régionale', price: 500000, daily: 125000, total: 12500000, locked: true },
    { id: 9, name: 'Complexe Solaire National', price: 1000000, daily: 260000, total: 26000000, locked: true },
    { id: 10, name: 'Mégastructure Nova Elite', price: 2500000, daily: 700000, total: 70000000, locked: true }
  ];

  // --- ACTIONS ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone || !password) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    setIsLoggedIn(true);
  };

  const handleBuyPackage = (pkg) => {
    if (pkg.locked) {
      alert("Ce niveau est strictement verrouillé et indisponible.");
      return;
    }
    if (userBalance < pkg.price) {
      alert("Solde insuffisant ! Veuillez recharger votre compte.");
      setActiveTab('recharge');
      return;
    }
    setUserBalance(userBalance - pkg.price);
    setActivePackages([...activePackages, { id: pkg.id, name: pkg.name, price: pkg.price, daily: pkg.daily, daysLeft: 100 }]);
    alert(`Félicitations ! Vous avez souscrit au ${pkg.name} avec succès.`);
  };

  const handleRechargeSubmit = (e) => {
    e.preventDefault();
    if (!rechargeAmount || !transactionId) {
      alert('Veuillez entrer le montant et l’ID de transaction Orange Money.');
      return;
    }
    setPendingRecharges([...pendingRecharges, { id: 'RCH-' + Math.floor(Math.random()*10000), user: countryCode + ' ' + phone, amount: Number(rechargeAmount), txId: transactionId }]);
    alert('Demande de recharge soumise avec succès ! En attente de validation admin.');
    setRechargeAmount('');
    setTransactionId('');
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (amt < 2000) {
      alert('Le seuil minimum de retrait est de 2 000 FCFA.');
      return;
    }
    if (amt > userBalance) {
      alert('Solde insuffisant pour ce retrait.');
      return;
    }
    setUserBalance(userBalance - amt);
    setPendingWithdrawals([...pendingWithdrawals, { id: 'WDR-' + Math.floor(Math.random()*10000), user: withdrawPhone, amount: amt, phone: withdrawPhone }]);
    alert('Demande de retrait enregistrée avec succès !');
    setWithdrawAmount('');
    setWithdrawPhone('');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: 'user', text: inputMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInputMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'support', text: 'Votre message a bien été pris en compte par le support NovaSolar.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    }, 1000);
  };

  // --- RENDU AUTH ---
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ color: '#F59E0B', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>☀️ NovaSolar</h1>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>Investissement & Énergie Solaire Moderne</p>
          </div>

          <div style={{ display: 'flex', marginBottom: '20px', backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '4px' }}>
            <button onClick={() => setAuthView('login')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', backgroundColor: authView === 'login' ? '#ffffff' : 'transparent', fontWeight: 'bold', cursor: 'pointer', color: authView === 'login' ? '#1F2937' : '#6B7280' }}>Se connecter</button>
            <button onClick={() => setAuthView('register')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', backgroundColor: authView === 'register' ? '#ffffff' : 'transparent', fontWeight: 'bold', cursor: 'pointer', color: authView === 'register' ? '#1F2937' : '#6B7280' }}>S'inscrire</button>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>Numéro de téléphone</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontWeight: 'bold' }}>
                  <option value="+226">🇧🇫 +226</option>
                  <option value="+225">🇨🇮 +225</option>
                  <option value="+223">🇲🇱 +223</option>
                  <option value="+237">🇨🇲 +237</option>
                </select>
                <input type="tel" placeholder="70 00 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#6B7280' }}>
                  {showPassword ? 'Cacher' : 'Voir'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563', cursor: 'pointer' }}>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Rester connecté
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Contactez le support pour réinitialiser le mot de passe."); }} style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 'bold' }}>Mot de passe oublié ?</a>
            </div>

            <button type="submit" style={{ backgroundColor: '#F59E0B', color: '#ffffff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}>
              {authView === 'login' ? 'Connexion' : 'Créer un compte'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- PANNEAU ADMIN ---
  if (isAdminMode) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', fontFamily: 'sans-serif', paddingBottom: '40px' }}>
        <header style={{ backgroundColor: '#1F2937', color: '#ffffff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>👑 Panneau Administrateur NovaSolar</h2>
          <button onClick={() => setIsAdminMode(false)} style={{ backgroundColor: '#EF4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Quitter Admin</button>
        </header>

        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#1F2937' }}>💳 Validation des Recharges en attente</h3>
            {pendingRecharges.length === 0 ? <p style={{ color: '#6B7280' }}>Aucune recharge en attente.</p> : (
              pendingRecharges.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #E5E7EB' }}>
                  <div>
                    <strong>{r.user}</strong> - {r.amount} FCFA <br />
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>ID Tx: {r.txId}</span>
                  </div>
                  <button onClick={() => {
                    setUserBalance(userBalance + r.amount);
                    setPendingRecharges(pendingRecharges.filter((_, idx) => idx !== i));
                    alert('Recharge validée avec succès !');
                  }} style={{ backgroundColor: '#10B981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Valider</button>
                </div>
              ))
            )}
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3>💸 Validation des Retraits en attente</h3>
            {pendingWithdrawals.length === 0 ? <p style={{ color: '#6B7280' }}>Aucun retrait en attente.</p> : (
              pendingWithdrawals.map((w, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #E5E7EB' }}>
                  <div>
                    <strong>{w.phone}</strong> - {w.amount} FCFA
                  </div>
                  <button onClick={() => {
                    setPendingWithdrawals(pendingWithdrawals.filter((_, idx) => idx !== i));
                    alert('Retrait payé et validé !');
                  }} style={{ backgroundColor: '#3B82F6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Marquer Payé</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- INTERFACE CLIENT ---
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'sans-serif', paddingBottom: '80px', maxWidth: '480px', margin: '0 auto', position: 'relative', boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
      {/* En-tête */}
      <header style={{ backgroundColor: '#ffffff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#F59E0B', fontWeight: 'bold' }}>☀️ NovaSolar</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setIsAdminMode(true)} style={{ backgroundColor: '#1F2937', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>👑 Admin</button>
          <button onClick={() => setIsLoggedIn(false)} style={{ backgroundColor: '#F3F4F6', color: '#EF4444', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Quitter</button>
        </div>
      </header>

      {/* Contenu dynamique selon l'onglet */}
      <div style={{ padding: '16px' }}>
        
        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ backgroundColor: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', background: '#F59E0B', color: '#ffffff', padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', opacity: 0.9 }}>Solde Principal</p>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 'bold' }}>{userBalance.toLocaleString()} FCFA</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setActiveTab('recharge')} style={{ flex: 1, backgroundColor: '#ffffff', color: '#D97706', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Recharger</button>
                <button onClick={() => setActiveTab('withdraw')} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Retirer</button>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>⚡ Équipements Actifs ({activePackages.length})</h4>
              {activePackages.length === 0 ? <p style={{ color: '#6B7280', fontSize: '14px' }}>Aucun équipement actif pour le moment.</p> : (
                activePackages.map((p, idx) => (
                  <div key={idx} style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#1F2937' }}>{p.name}</strong>
                      <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>+{p.daily} FCFA / jour</div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6B7280', backgroundColor: '#E5E7EB', padding: '4px 8px', borderRadius: '4px' }}>{p.daysLeft} jours restants</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>💬 Support Client en direct</h4>
              <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', paddingRight: '4px' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: m.sender === 'user' ? '#FEF3C7' : '#F3F4F6', padding: '8px 12px', borderRadius: '8px', maxWidth: '80%', fontSize: '13px' }}>
                    {m.text}
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Écrire un message..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '13px' }} />
                <button type="submit" style={{ backgroundColor: '#F59E0B', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Envoyer</button>
              </form>
            </div>
          </div>
        )}

        {/* 2. CATALOGUE FORFAITS */}
        {activeTab === 'packages' && (
          <div>
            <h3 style={{ color: '#1F2937', marginTop: 0 }}>Catalogue des Forfaits Solaires (100 Jours)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {packagesList.map((pkg) => (
                <div key={pkg.id} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: pkg.locked ? '1px dashed #D1D5DB' : '1px solid #E5E7EB', opacity: pkg.locked ? 0.75 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#1F2937' }}>Niveau {pkg.id} - {pkg.name}</h4>
                      <span style={{ fontSize: '12px', color: pkg.locked ? '#EF4444' : '#10B981', fontWeight: 'bold' }}>
                        {pkg.locked ? '🔒 Indisponible / Verrouillé' : '✅ Disponible à l’achat'}
                      </span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#D97706', fontSize: '16px' }}>{pkg.price.toLocaleString()} FCFA</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#4B5563', marginBottom: '12px' }}>
                    Gain journalier : <strong>+{pkg.daily.toLocaleString()} FCFA</strong> (Total : {pkg.total.toLocaleString()} FCFA)
                  </div>
                  <button 
                    onClick={() => handleBuyPackage(pkg)} 
                    disabled={pkg.locked}
                    style={{ width: '100%', backgroundColor: pkg.locked ? '#9CA3AF' : '#F59E0B', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: pkg.locked ? 'not-allowed' : 'pointer' }}>
                    {pkg.locked ? 'Verrouillé' : 'Souscrire maintenant'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. RECHARGE */}
        {activeTab === 'recharge' && (
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ marginTop: 0, color: '#1F2937' }}>💳 Recharge Orange Money</h3>
            <div style={{ backgroundColor: '#FEF3C7', padding: '14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#92400E' }}>
              <strong>Notice d'achat :</strong><br/>
              1. Effectuez votre dépôt Orange Money au numéro officiel :<br/>
              <strong style={{ fontSize: '15px' }}>📞 77 47 78 92 (COLETTE AGATHE ZOULAYA)</strong><br/>
              2. Saisissez le montant et l'ID de transaction ci-dessous.
            </div>
            <form onSubmit={handleRechargeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>Montant (FCFA)</label>
                <input type="number" placeholder="Ex: 5000" value={rechargeAmount} onChange={(e) => setRechargeAmount(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>ID de transaction Orange Money</label>
                <input type="text" placeholder="Ex: OM12345678" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ backgroundColor: '#F59E0B', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Valider la recharge</button>
            </form>
          </div>
        )}

        {/* 4. RETRAIT */}
        {activeTab === 'withdraw' && (
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ marginTop: 0, color: '#1F2937' }}>💸 Demande de Retrait</h3>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>Seuil minimum : <strong>2 000 FCFA</strong></p>
            <form onSubmit={handleWithdrawSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>Montant à retirer (FCFA)</label>
                <input type="number" placeholder="Min 2000" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>Numéro de téléphone (Orange Money)</label>
                <input type="tel" placeholder="+226 70 00 00 00" value={withdrawPhone} onChange={(e) => setWithdrawPhone(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ backgroundColor: '#10B981', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Soumettre le retrait</button>
            </form>
          </div>
        )}

        {/* 5. RÉSEAU & PARRAINAGE */}
        {activeTab === 'network' && (
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ marginTop: 0, color: '#1F2937' }}>👥 Parrainage & MLM</h3>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>Gagnez des commissions sur 3 niveaux : <br/><strong>Niveau 1 (25%) | Niveau 2 (2%) | Niveau 3 (1%)</strong></p>
            <div style={{ backgroundColor: '#F3F4F6', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#4B5563', display: 'block', marginBottom: '4px' }}>Votre code d'invitation unique :</span>
              <strong style={{ fontSize: '18px', color: '#D97706' }}>NOVA882</strong>
            </div>
            <button onClick={() => alert('Lien copié dans le presse-papier !')} style={{ width: '100%', backgroundColor: '#F59E0B', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Copier le lien de parrainage</button>
          </div>
        )}

        {/* 6. COMPTE */}
        {activeTab === 'account' && (
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#FEE2E2', color: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 12px auto' }}>👤</div>
            <h3 style={{ margin: '0 0 4px 0', color: '#1F2937' }}>Mon Compte NovaSolar</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>{countryCode} {phone || '70 00 00 00'}</p>
            <button onClick={() => setIsLoggedIn(false)} style={{ backgroundColor: '#EF4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Se déconnecter</button>
          </div>
        )}

      </div>

      {/* Barre de navigation inférieure mobile */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-around', padding: '8px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'dashboard' ? '#F59E0B' : '#6B7280', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>🏠</span> Accueil
        </button>
        <button onClick={() => setActiveTab('packages')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'packages' ? '#F59E0B' : '#6B7280', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>⚡</span> Forfaits
        </button>
        <button onClick={() => setActiveTab('recharge')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'recharge' ? '#F59E0B' : '#6B7280', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>💳</span> Recharge
        </button>
        <button onClick={() => setActiveTab('network')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'network' ? '#F59E0B' : '#6B7280', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>👥</span> Réseau
        </button>
        <button onClick={() => setActiveTab('account')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'account' ? '#F59E0B' : '#6B7280', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>⚙️</span> Compte
        </button>
      </nav>
    </div>
  );
}
