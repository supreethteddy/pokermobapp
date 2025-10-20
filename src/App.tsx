import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clubCode, setClubCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Tables page state
  const [tables, setTables] = useState([
    {
      id: 1,
      name: "Table 1: No-Limit Hold'em",
      gameType: "NLH",
      blinds: "$1/$2",
      minBuyIn: 100,
      players: 7,
      maxPlayers: 9,
      status: "active",
      waitlistCount: 0,
      dealer: "John",
      rake: 5
    },
    {
      id: 2,
      name: "Table 2: Pot-Limit Omaha",
      gameType: "PLO",
      blinds: "$2/$5",
      minBuyIn: 200,
      players: 9,
      maxPlayers: 9,
      status: "full",
      waitlistCount: 2,
      dealer: "Sarah",
      rake: 10
    },
    {
      id: 3,
      name: "Table 3: Sit & Go",
      gameType: "SNG",
      blinds: "$1/$2",
      minBuyIn: 50,
      players: 4,
      maxPlayers: 6,
      status: "starting",
      waitlistCount: 0,
      dealer: "Mike",
      rake: 5
    },
    {
      id: 4,
      name: "Table 4: High Stakes NLH",
      gameType: "NLH",
      blinds: "$5/$10",
      minBuyIn: 500,
      players: 6,
      maxPlayers: 9,
      status: "active",
      waitlistCount: 1,
      dealer: "Alex",
      rake: 15
    }
  ]);
  
  const [userWaitlists, setUserWaitlists] = useState([
    {
      tableId: 2,
      tableName: "Table 2: Pot-Limit Omaha",
      position: 1,
      joinedAt: "2024-01-15 14:30"
    }
  ]);
  
  const [currentSession, setCurrentSession] = useState(null);
  
  // Wallet page state
  const [balance, setBalance] = useState(2450);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'deposit',
      amount: 500,
      status: 'completed',
      date: '2024-01-15 14:30',
      description: 'Bank Transfer Deposit',
      reference: 'TXN001'
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: 200,
      status: 'pending',
      date: '2024-01-15 16:45',
      description: 'Cash Withdrawal Request',
      reference: 'TXN002'
    },
    {
      id: 3,
      type: 'credit',
      amount: 100,
      status: 'completed',
      date: '2024-01-14 10:20',
      description: 'Credit Approved by Admin',
      reference: 'TXN003'
    },
    {
      id: 4,
      type: 'rake',
      amount: -25,
      status: 'completed',
      date: '2024-01-14 18:30',
      description: 'Table Rake - Table 1',
      reference: 'TXN004'
    },
    {
      id: 5,
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      date: '2024-01-13 09:15',
      description: 'UPI Payment',
      reference: 'TXN005'
    }
  ]);
  
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      type: 'withdrawal',
      amount: 200,
      date: '2024-01-15 16:45',
      status: 'pending_approval'
    }
  ]);
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  
  // Chat page state
  const [isVerifiedPlayer, setIsVerifiedPlayer] = useState(true); // GRE/Manager verified
  const [currentChat, setCurrentChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      staffName: 'Sarah (Manager)',
      staffRole: 'Manager',
      lastMessage: 'Your withdrawal request has been approved',
      lastMessageTime: '2024-01-15 16:45',
      unreadCount: 0,
      status: 'resolved',
      messages: [
        {
          id: 1,
          sender: 'staff',
          senderName: 'Sarah (Manager)',
          message: 'Hello! How can I help you today?',
          timestamp: '2024-01-15 14:30',
          isRead: true
        },
        {
          id: 2,
          sender: 'user',
          senderName: 'You',
          message: 'I need help with my withdrawal request',
          timestamp: '2024-01-15 14:32',
          isRead: true
        },
        {
          id: 3,
          sender: 'staff',
          senderName: 'Sarah (Manager)',
          message: 'I can see your withdrawal request for $200. Let me check the status for you.',
          timestamp: '2024-01-15 14:35',
          isRead: true
        },
        {
          id: 4,
          sender: 'staff',
          senderName: 'Sarah (Manager)',
          message: 'Your withdrawal request has been approved and will be processed within 24 hours.',
          timestamp: '2024-01-15 16:45',
          isRead: true
        }
      ]
    },
    {
      id: 2,
      staffName: 'Mike (GRE)',
      staffRole: 'GRE',
      lastMessage: 'Your KYC documents look good',
      lastMessageTime: '2024-01-14 10:20',
      unreadCount: 0,
      status: 'resolved',
      messages: [
        {
          id: 1,
          sender: 'staff',
          senderName: 'Mike (GRE)',
          message: 'Hi! I\'m reviewing your KYC documents.',
          timestamp: '2024-01-14 09:15',
          isRead: true
        },
        {
          id: 2,
          sender: 'user',
          senderName: 'You',
          message: 'Thank you! Let me know if you need anything else.',
          timestamp: '2024-01-14 09:20',
          isRead: true
        },
        {
          id: 3,
          sender: 'staff',
          senderName: 'Mike (GRE)',
          message: 'Your KYC documents look good. Verification should be complete soon.',
          timestamp: '2024-01-14 10:20',
          isRead: true
        }
      ]
    },
    {
      id: 3,
      staffName: 'Alex (Support)',
      staffRole: 'Support',
      lastMessage: 'I\'ll help you with table selection',
      lastMessageTime: '2024-01-13 18:30',
      unreadCount: 0,
      status: 'resolved',
      messages: [
        {
          id: 1,
          sender: 'user',
          senderName: 'You',
          message: 'Which tables are available for NLH?',
          timestamp: '2024-01-13 18:25',
          isRead: true
        },
        {
          id: 2,
          sender: 'staff',
          senderName: 'Alex (Support)',
          message: 'I\'ll help you with table selection. Let me check current availability.',
          timestamp: '2024-01-13 18:30',
          isRead: true
        }
      ]
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedStaffRole, setSelectedStaffRole] = useState('');
  
  // Profile page state
  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street, City, State 12345',
    playerCode: 'PC-ALX-2024-001', // Auto-generated on signup
    membershipStatus: 'Gold',
    membershipTier: 'VIP Gold',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-15 16:45',
    totalGames: 156,
    totalWinnings: 2450
  });
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editForm, setEditForm] = useState(profileData);
  
  // KYC page state
  const [kycStatus, setKycStatus] = useState('pending'); // pending, approved, rejected
  const [kycDocuments, setKycDocuments] = useState([
    {
      id: 1,
      type: 'aadhaar',
      name: 'Aadhaar Card',
      fileName: 'aadhaar_card_front.jpg',
      uploadDate: '2024-01-15 14:30',
      status: 'pending',
      fileSize: '2.1 MB',
      downloadUrl: '#'
    },
    {
      id: 2,
      type: 'pan',
      name: 'PAN Card',
      fileName: 'pan_card.jpg',
      uploadDate: '2024-01-15 14:32',
      status: 'approved',
      fileSize: '1.8 MB',
      downloadUrl: '#'
    }
  ]);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle) => {
        const element = particle as HTMLElement;
        element.style.transform = `translateX(${Math.random() * 100}px) translateY(${Math.random() * 100}px)`;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('clubCode');
    }, 2000);
  };

  const handleClubCodeSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('dashboard');
    }, 2000);
  };

  const handleRequestDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount >= 1000) { // Min deposit: 1000
      const newTransaction = {
        id: transactions.length + 1,
        type: 'deposit',
        amount: amount,
        status: 'pending',
        date: new Date().toLocaleString(),
        description: 'Deposit Request',
        reference: `TXN${String(transactions.length + 1).padStart(3, '0')}`
      };
      setTransactions([newTransaction, ...transactions]);
      setShowDepositModal(false);
      setDepositAmount('');
    }
  };

  const handleRequestWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount <= balance && amount > 0) { // Max withdrawal: Account balance
      const newTransaction = {
        id: transactions.length + 1,
        type: 'withdrawal',
        amount: amount,
        status: 'pending',
        date: new Date().toLocaleString(),
        description: 'Withdrawal Request',
        reference: `TXN${String(transactions.length + 1).padStart(3, '0')}`
      };
      setTransactions([newTransaction, ...transactions]);
      setPendingRequests([...pendingRequests, {
        id: pendingRequests.length + 1,
        type: 'withdrawal',
        amount: amount,
        date: new Date().toLocaleString(),
        status: 'pending_approval'
      }]);
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentChat) {
      const message = {
        id: Date.now(),
        sender: 'user',
        senderName: 'You',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleString(),
        isRead: true
      };
      
      // Update current chat messages
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, message],
        lastMessage: newMessage.trim(),
        lastMessageTime: new Date().toLocaleString()
      };
      
      setCurrentChat(updatedChat);
      
      // Update chat history
      setChatHistory(chatHistory.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      ));
      
      setNewMessage('');
      
      // Simulate staff response after 2 seconds
      setTimeout(() => {
        const staffResponse = {
          id: Date.now() + 1,
          sender: 'staff',
          senderName: currentChat.staffName,
          message: 'Thank you for your message. I\'ll get back to you shortly.',
          timestamp: new Date().toLocaleString(),
          isRead: true
        };
        
        const updatedChatWithResponse = {
          ...updatedChat,
          messages: [...updatedChat.messages, staffResponse],
          lastMessage: staffResponse.message,
          lastMessageTime: staffResponse.timestamp
        };
        
        setCurrentChat(updatedChatWithResponse);
        setChatHistory(chatHistory.map(chat => 
          chat.id === currentChat.id ? updatedChatWithResponse : chat
        ));
      }, 2000);
    }
  };

  const handleStartNewChat = () => {
    const staffRoles = ['Manager', 'GRE', 'Support'];
    const randomRole = staffRoles[Math.floor(Math.random() * staffRoles.length)];
    const staffNames = {
      'Manager': 'Sarah (Manager)',
      'GRE': 'Mike (GRE)', 
      'Support': 'Alex (Support)'
    };
    
    const newChat = {
      id: Date.now(),
      staffName: staffNames[randomRole],
      staffRole: randomRole,
      lastMessage: 'Chat started',
      lastMessageTime: new Date().toLocaleString(),
      unreadCount: 0,
      status: 'active',
      messages: [
        {
          id: 1,
          sender: 'staff',
          senderName: staffNames[randomRole],
          message: 'Hello! How can I help you today?',
          timestamp: new Date().toLocaleString(),
          isRead: true
        }
      ]
    };
    
    setChatHistory([newChat, ...chatHistory]);
    setCurrentChat(newChat);
    setShowNewChatModal(false);
  };

  const handleUpdateProfile = () => {
    setProfileData(editForm);
    setShowEditModal(false);
  };

  const handleChangePassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      // Simulate password change
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      // In real app, this would make API call to change password
    }
  };

  const handleEditProfile = () => {
    setEditForm(profileData);
    setShowEditModal(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadDocument = () => {
    if (selectedDocumentType && uploadedFile) {
      const newDocument = {
        id: Date.now(),
        type: selectedDocumentType,
        name: selectedDocumentType === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card',
        fileName: uploadedFile.name,
        uploadDate: new Date().toLocaleString(),
        status: 'pending',
        fileSize: (uploadedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        downloadUrl: '#'
      };
      
      setKycDocuments([newDocument, ...kycDocuments]);
      setShowUploadModal(false);
      setSelectedDocumentType('');
      setUploadedFile(null);
    }
  };

  const handleReUploadDocument = (documentId) => {
    const document = kycDocuments.find(doc => doc.id === documentId);
    if (document) {
      setSelectedDocumentType(document.type);
      setShowUploadModal(true);
    }
  };

  const handleDownloadDocument = (documentId) => {
    const document = kycDocuments.find(doc => doc.id === documentId);
    if (document) {
      // In real app, this would trigger actual file download
      console.log(`Downloading ${document.fileName}`);
    }
  };

  const handleJoinWaitlist = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.status === 'full') {
      const newWaitlist = {
        tableId: tableId,
        tableName: table.name,
        position: table.waitlistCount + 1,
        joinedAt: new Date().toLocaleString()
      };
      setUserWaitlists([...userWaitlists, newWaitlist]);
      
      // Update table waitlist count
      setTables(tables.map(t => 
        t.id === tableId ? { ...t, waitlistCount: t.waitlistCount + 1 } : t
      ));
    }
  };

  const handleLeaveWaitlist = (tableId: number) => {
    setUserWaitlists(userWaitlists.filter(w => w.tableId !== tableId));
    
    // Update table waitlist count and positions
    setTables(tables.map(t => 
      t.id === tableId ? { ...t, waitlistCount: Math.max(0, t.waitlistCount - 1) } : t
    ));
    
    // Update positions for remaining waitlist entries
    setUserWaitlists(userWaitlists.map((w, index) => ({
      ...w,
      position: index + 1
    })));
  };

  const handleJoinTable = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.status === 'active' && table.players < table.maxPlayers) {
      // Simulate joining table
      setCurrentSession({
        tableId: tableId,
        tableName: table.name,
        buyIn: table.minBuyIn,
        startTime: new Date(),
        status: 'playing'
      });
      
      // Update table player count
      setTables(tables.map(t => 
        t.id === tableId ? { ...t, players: t.players + 1 } : t
      ));
    }
  };

  const renderLoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transition: 'transform 3s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo Area */}
        <div className="mb-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <i className="fas fa-spade-suit text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">PokerCRM</h1>
          <p className="text-cyan-300 text-lg">Premium Poker Club Experience</p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-cyan-300 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 text-sm"
                  placeholder="Enter your email"
                />
                <i className="fas fa-envelope absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm"></i>
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-cyan-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 text-sm pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 !rounded-button cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors cursor-pointer">
                Forgot Password?
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-slate-400">or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-slate-400 text-sm">Don't have an account? </span>
              <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors cursor-pointer">
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-xs">Secure • Encrypted • Premium</p>
        </div>
      </div>
    </div>
  );

  const renderClubCodeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse">
            <i className="fas fa-key text-2xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Enter Club Code</h1>
          <p className="text-purple-300 text-base px-4">Enter your exclusive poker club access code to join your premium gaming environment</p>
        </div>

        {/* Club Code Input */}
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <div className="space-y-8">
            <div className="relative">
              <label className="block text-sm font-medium text-purple-300 mb-3 text-center">Club Access Code</label>
              <div className="relative">
                <input
                  type="text"
                  value={clubCode}
                  onChange={(e) => setClubCode(e.target.value.toUpperCase())}
                  className="w-full px-6 py-5 bg-slate-800/50 border-2 border-purple-500/30 rounded-2xl text-white text-center text-xl font-mono tracking-widest placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                  placeholder="CLUB-CODE"
                  maxLength={12}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl pointer-events-none"></div>
              </div>
            </div>

            <button
              onClick={handleClubCodeSubmit}
              disabled={isLoading || clubCode.length < 6}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed !rounded-button cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Join Club'
              )}
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm mb-4">Need help finding your club code?</p>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors cursor-pointer">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );

  const renderBottomNavigation = () => (
    <div className="fixed bottom-0 w-full bg-slate-900/80 backdrop-blur-lg border-t border-cyan-500/20">
      <div className="grid grid-cols-6 py-3">
        <button 
          onClick={() => setCurrentScreen('dashboard')} 
          className={`flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${currentScreen === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
        >
          <i className="fas fa-home text-lg mb-1"></i>
          <span className="text-xs">Home</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('tables')} 
          className={`flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${currentScreen === 'tables' ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
        >
          <i className="fas fa-table text-lg mb-1"></i>
          <span className="text-xs">Tables</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('wallet')} 
          className={`flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${currentScreen === 'wallet' ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
        >
          <i className="fas fa-wallet text-lg mb-1"></i>
          <span className="text-xs">Wallet</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('chat')} 
          className={`flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${currentScreen === 'chat' ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
        >
          <i className="fas fa-comments text-lg mb-1"></i>
          <span className="text-xs">Chat</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('kyc')} 
          className={`flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${currentScreen === 'kyc' ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
        >
          <i className="fas fa-id-card text-lg mb-1"></i>
          <span className="text-xs">KYC</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('profile')} 
          className={`flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${currentScreen === 'profile' ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
        >
          <i className="fas fa-user text-lg mb-1"></i>
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );

  const renderKYCScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transition: 'transform 3s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-cyan-500/20 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <i className="fas fa-id-card text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">KYC Verification</h1>
              <p className="text-cyan-300 text-xs">Elite Poker Club</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-bell text-sm"></i>
            </button>
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-user text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24 px-6">
        {/* Verification Status */}
        <div className={`backdrop-blur-lg rounded-2xl p-6 border shadow-lg mb-6 ${
          kycStatus === 'approved' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 shadow-green-500/10' :
          kycStatus === 'rejected' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30 shadow-red-500/10' :
          'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 shadow-yellow-500/10'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                kycStatus === 'approved' ? 'bg-green-500' :
                kycStatus === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}>
                <i className={`fas text-white text-lg ${
                  kycStatus === 'approved' ? 'fa-check' :
                  kycStatus === 'rejected' ? 'fa-times' : 'fa-clock'
                }`}></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">KYC Verification Status</h3>
                <p className={`text-sm ${
                  kycStatus === 'approved' ? 'text-green-300' :
                  kycStatus === 'rejected' ? 'text-red-300' : 'text-yellow-300'
                }`}>
                  {kycStatus === 'approved' ? 'Verified & Approved' :
                   kycStatus === 'rejected' ? 'Rejected - Action Required' : 'Pending Review'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${
                kycStatus === 'approved' ? 'text-green-400' :
                kycStatus === 'rejected' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {kycStatus === 'approved' ? '✓ Approved' :
                 kycStatus === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
              </div>
              <div className="text-slate-400 text-xs">24hr review time</div>
            </div>
          </div>
        </div>

        {/* Upload Documents */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Upload Documents</h3>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl transition-colors text-sm"
            >
              <i className="fas fa-upload mr-1"></i>
              Upload Document
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-id-card text-white text-sm"></i>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Aadhaar Card</h4>
                  <p className="text-slate-400 text-xs">Required for verification</p>
                </div>
              </div>
              <div className="text-slate-300 text-sm">
                Upload clear photo of your Aadhaar card (front and back)
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-credit-card text-white text-sm"></i>
                </div>
                <div>
                  <h4 className="text-white font-semibold">PAN Card</h4>
                  <p className="text-slate-400 text-xs">Required for verification</p>
                </div>
              </div>
              <div className="text-slate-300 text-sm">
                Upload clear photo of your PAN card
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Documents */}
        <h3 className="text-white text-lg font-semibold mb-4">Submitted Documents</h3>
        <div className="space-y-3 mb-6">
          {kycDocuments.map((document) => {
            const statusColors = {
              approved: 'text-green-400',
              pending: 'text-yellow-400',
              rejected: 'text-red-400'
            };
            const statusIcons = {
              approved: 'fa-check-circle',
              pending: 'fa-clock',
              rejected: 'fa-times-circle'
            };
            const statusBgColors = {
              approved: 'bg-green-500',
              pending: 'bg-yellow-500',
              rejected: 'bg-red-500'
            };

            return (
              <div key={document.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${statusBgColors[document.status]} rounded-full flex items-center justify-center`}>
                      <i className={`fas ${statusIcons[document.status]} text-white text-sm`}></i>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{document.name}</h4>
                      <p className="text-slate-400 text-sm">{document.fileName}</p>
                      <p className="text-slate-400 text-xs">{document.uploadDate} • {document.fileSize}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-3">
                      <div className={`text-sm font-semibold ${statusColors[document.status]}`}>
                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadDocument(document.id)}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-2 py-2 rounded-lg text-xs transition-colors whitespace-nowrap"
                    >
                      <i className="fas fa-download mr-1"></i>
                      Download
                    </button>
                    {document.status === 'rejected' && (
                      <button
                        onClick={() => handleReUploadDocument(document.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-lg text-xs transition-colors whitespace-nowrap"
                      >
                        <i className="fas fa-upload mr-1"></i>
                        Re-upload
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* KYC Guidelines */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg">
          <h3 className="text-white font-bold text-lg mb-4">KYC Guidelines</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start space-x-3">
              <i className="fas fa-check text-green-400 text-xs mt-1"></i>
              <span>Ensure documents are clear and readable</span>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-check text-green-400 text-xs mt-1"></i>
              <span>Upload high-resolution images (minimum 1MB)</span>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-check text-green-400 text-xs mt-1"></i>
              <span>All corners of the document should be visible</span>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-check text-green-400 text-xs mt-1"></i>
              <span>Documents should not be expired</span>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-check text-green-400 text-xs mt-1"></i>
              <span>Review process takes up to 24 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-cyan-500/20">
            <h3 className="text-white text-lg font-bold mb-4">Upload Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Document Type</label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                >
                  <option value="">Select document type...</option>
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="pan">PAN Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Upload File</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                />
                {uploadedFile && (
                  <p className="text-green-400 text-xs mt-2">
                    Selected: {uploadedFile.name}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadDocument}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderBottomNavigation()}
    </div>
  );

  const renderProfileScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transition: 'transform 3s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-cyan-500/20 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Profile</h1>
              <p className="text-cyan-300 text-xs">Elite Poker Club</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-bell text-sm"></i>
            </button>
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-user text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24 px-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-2xl"></i>
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-xl">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-cyan-300 text-sm">{profileData.email}</p>
              <p className="text-slate-300 text-xs">Member since {profileData.joinDate}</p>
            </div>
            <button 
              onClick={handleEditProfile}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl transition-colors text-sm"
            >
              <i className="fas fa-edit mr-1"></i>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Player Code */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <i className="fas fa-id-card text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Player Code</h3>
                <p className="text-orange-300 text-sm">Auto-generated on signup</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-xl font-bold font-mono">{profileData.playerCode}</div>
              <button className="text-orange-400 text-xs hover:text-orange-300 transition-colors">
                <i className="fas fa-copy mr-1"></i>
                Copy Code
              </button>
            </div>
          </div>
        </div>

        {/* Membership Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <i className="fas fa-crown text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Membership Status</h3>
                <p className="text-yellow-300 text-sm">{profileData.membershipTier}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-xl font-bold">{profileData.membershipStatus}</div>
              <div className="text-yellow-400 text-xs">VIP Member</div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg mb-6">
          <h3 className="text-white font-bold text-lg mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">First Name</label>
                <div className="text-white text-sm">{profileData.firstName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Last Name</label>
                <div className="text-white text-sm">{profileData.lastName}</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Email Address</label>
              <div className="text-white text-sm">{profileData.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Phone Number</label>
              <div className="text-white text-sm">{profileData.phone}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Date of Birth</label>
              <div className="text-white text-sm">{profileData.dateOfBirth}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Address</label>
              <div className="text-white text-sm">{profileData.address}</div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20 shadow-lg text-center">
            <div className="text-white text-2xl font-bold">{profileData.totalGames}</div>
            <div className="text-cyan-300 text-xs">Total Games</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20 shadow-lg text-center">
            <div className="text-white text-2xl font-bold">${profileData.totalWinnings}</div>
            <div className="text-cyan-300 text-xs">Total Winnings</div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4">
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-key text-sm"></i>
            <span>Change Password</span>
          </button>
          
          <div className="text-center text-slate-400 text-xs">
            Last login: {profileData.lastLogin}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-cyan-500/20 max-h-[80vh] overflow-y-auto">
            <h3 className="text-white text-lg font-bold mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-cyan-500/20">
            <h3 className="text-white text-lg font-bold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderBottomNavigation()}
    </div>
  );

  const renderChatScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transition: 'transform 3s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-cyan-500/20 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <i className="fas fa-comments text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Support Chat</h1>
              <p className="text-cyan-300 text-xs">Elite Poker Club</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-bell text-sm"></i>
            </button>
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-user text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24 px-6">
        {/* Verification Status */}
        {isVerifiedPlayer ? (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-4 border border-green-500/30 shadow-lg shadow-green-500/10 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-white text-sm"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Verified Player</h3>
                <p className="text-green-300 text-xs">You can access support chat</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-4 border border-red-500/30 shadow-lg shadow-red-500/10 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <i className="fas fa-times text-white text-sm"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Verification Required</h3>
                <p className="text-red-300 text-xs">Contact GRE/Manager for verification</p>
              </div>
            </div>
          </div>
        )}

        {isVerifiedPlayer && (
          <>
            {/* Start New Chat Button */}
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center space-x-2 mb-6"
            >
              <i className="fas fa-plus text-sm"></i>
              <span>Start Support Chat</span>
            </button>

            {/* Chat History */}
            <h2 className="text-white text-lg font-semibold mb-4">Chat History</h2>
            <div className="space-y-3 mb-6">
              {chatHistory.map((chat) => {
                const statusColors = {
                  active: 'text-green-400',
                  resolved: 'text-blue-400',
                  closed: 'text-gray-400'
                };
                const statusIcons = {
                  active: 'fa-circle',
                  resolved: 'fa-check-circle',
                  closed: 'fa-times-circle'
                };

                return (
                  <div 
                    key={chat.id} 
                    onClick={() => setCurrentChat(chat)}
                    className={`bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20 shadow-lg cursor-pointer hover:bg-white/15 transition-colors ${
                      currentChat?.id === chat.id ? 'ring-2 ring-cyan-400' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-white text-sm"></i>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{chat.staffName}</h3>
                          <p className="text-slate-300 text-sm">{chat.staffRole}</p>
                          <p className="text-slate-400 text-xs">{chat.lastMessage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-semibold ${statusColors[chat.status]}`}>
                          <i className={`fas ${statusIcons[chat.status]} mr-1`}></i>
                          {chat.status}
                        </div>
                        <div className="text-slate-400 text-xs">{chat.lastMessageTime}</div>
                        {chat.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Chat Messages */}
            {currentChat && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-cyan-500/20 shadow-lg mb-6">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-white text-xs"></i>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{currentChat.staffName}</h3>
                      <p className="text-slate-300 text-xs">{currentChat.staffRole}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 max-h-80 overflow-y-auto">
                  <div className="space-y-4">
                    {currentChat.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                            : 'bg-slate-700 text-white'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-600">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                      placeholder="Type your message..."
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-3 rounded-xl transition-colors"
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-cyan-500/20">
            <h3 className="text-white text-lg font-bold mb-4">Start New Chat</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Select Staff Role</label>
                <select
                  value={selectedStaffRole}
                  onChange={(e) => setSelectedStaffRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                >
                  <option value="">Choose staff role...</option>
                  <option value="Manager">Manager</option>
                  <option value="GRE">GRE</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartNewChat}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-slate-900/80 backdrop-blur-lg border-t border-cyan-500/20">
        <div className="grid grid-cols-6 py-3">
          <button 
            onClick={() => setCurrentScreen('dashboard')} 
            className="flex flex-col items-center justify-center py-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <i className="fas fa-home text-lg mb-1"></i>
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('tables')} 
            className="flex flex-col items-center justify-center py-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <i className="fas fa-table text-lg mb-1"></i>
            <span className="text-xs">Tables</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('wallet')} 
            className="flex flex-col items-center justify-center py-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <i className="fas fa-wallet text-lg mb-1"></i>
            <span className="text-xs">Wallet</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('chat')} 
            className="flex flex-col items-center justify-center py-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <i className="fas fa-comments text-lg mb-1"></i>
            <span className="text-xs">Chat</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('kyc')} 
            className="flex flex-col items-center justify-center py-2 text-cyan-400 cursor-pointer"
          >
            <i className="fas fa-id-card text-lg mb-1"></i>
            <span className="text-xs">KYC</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('profile')} 
            className="flex flex-col items-center justify-center py-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <i className="fas fa-user text-lg mb-1"></i>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderWalletScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transition: 'transform 3s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-cyan-500/20 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <i className="fas fa-wallet text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Transactions</h1>
              <p className="text-cyan-300 text-xs">Elite Poker Club</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-bell text-sm"></i>
            </button>
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-user text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24 px-6">
        {/* 1. View Balance */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <i className="fas fa-wallet text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Current Balance</h3>
                <p className="text-green-300 text-sm">Available Funds</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-3xl font-bold">${balance.toLocaleString()}</div>
              <div className="text-green-300 text-xs">+$150 today</div>
            </div>
          </div>
        </div>

        {/* 2. Request Deposits/Withdrawals */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => setShowDepositModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-plus text-sm"></i>
            <span>Request Deposit</span>
          </button>
          <button 
            onClick={() => setShowWithdrawalModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-minus text-sm"></i>
            <span>Request Withdrawal</span>
          </button>
        </div>

        {/* 3. See Pending Approvals */}
        {pendingRequests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white text-lg font-semibold mb-4">Pending Approvals</h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-yellow-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-clock text-white text-sm"></i>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {request.type === 'withdrawal' ? 'Withdrawal Request' : 'Deposit Request'}
                        </h3>
                        <p className="text-yellow-300 text-sm">Amount: ${request.amount}</p>
                        <p className="text-slate-400 text-xs">{request.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 text-sm font-semibold">Pending</div>
                      <div className="text-slate-400 text-xs">Awaiting approval</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Transaction History */}
        <h2 className="text-white text-lg font-semibold mb-4">Transaction History</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const typeColors = {
              deposit: 'text-green-400',
              withdrawal: 'text-red-400',
              credit: 'text-blue-400',
              rake: 'text-purple-400'
            };
            const typeIcons = {
              deposit: 'fa-plus-circle',
              withdrawal: 'fa-minus-circle',
              credit: 'fa-gift',
              rake: 'fa-coins'
            };
            const statusColors = {
              completed: 'text-green-400',
              pending: 'text-yellow-400',
              failed: 'text-red-400'
            };

            return (
              <div key={transaction.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-green-500' :
                      transaction.type === 'withdrawal' ? 'bg-red-500' :
                      transaction.type === 'credit' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      <i className={`fas ${typeIcons[transaction.type]} text-white text-sm`}></i>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{transaction.description}</h3>
                      <p className="text-slate-400 text-sm">Ref: {transaction.reference}</p>
                      <p className="text-slate-400 text-xs">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${typeColors[transaction.type]}`}>
                      {transaction.amount > 0 ? '+' : ''}${transaction.amount}
                    </div>
                    <div className={`text-xs font-semibold ${statusColors[transaction.status]}`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-cyan-500/20">
            <h3 className="text-white text-lg font-bold mb-4">Request Deposit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Amount (Min: $1000)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                  placeholder="Enter amount"
                  min="1000"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestDeposit}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition-colors"
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-cyan-500/20">
            <h3 className="text-white text-lg font-bold mb-4">Request Withdrawal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Amount (Max: ${balance})</label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                  placeholder="Enter amount"
                  max={balance}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestWithdrawal}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition-colors"
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderBottomNavigation()}
    </div>
  );

  const renderTablesScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transition: 'transform 3s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-cyan-500/20 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <i className="fas fa-spade-suit text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Live Tables</h1>
              <p className="text-cyan-300 text-xs">Elite Poker Club</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-bell text-sm"></i>
            </button>
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-user text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24 px-6">
        {/* Current Session Tracker */}
        {currentSession && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-play text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Current Session</h3>
                  <p className="text-green-300 text-sm">{currentSession.tableName}</p>
                  <p className="text-green-300 text-xs">Buy-in: ${currentSession.buyIn}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-lg font-bold">2h 34m</div>
                <div className="text-green-300 text-xs">Session Time</div>
                <button className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  <i className="fas fa-sign-out-alt mr-1"></i>
                  Cash Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Your Waitlists */}
        {userWaitlists.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white text-lg font-semibold mb-4">Your Waitlists</h2>
            <div className="space-y-3">
              {userWaitlists.map((waitlist) => (
                <div key={waitlist.tableId} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-yellow-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{waitlist.tableName}</h3>
                      <p className="text-yellow-300 text-sm">Position #{waitlist.position}</p>
                      <p className="text-slate-400 text-xs">Joined: {waitlist.joinedAt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleLeaveWaitlist(waitlist.tableId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Tables */}
        <h2 className="text-white text-lg font-semibold mb-4">Available Tables</h2>
        <div className="space-y-4">
          {tables.map((table) => {
            const isOnWaitlist = userWaitlists.some(w => w.tableId === table.id);
            const statusColors = {
              active: 'text-green-400',
              full: 'text-red-400',
              starting: 'text-yellow-400'
            };
            const statusIcons = {
              active: 'fa-play-circle',
              full: 'fa-users',
              starting: 'fa-clock'
            };

            return (
              <div key={table.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-table text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{table.name}</h3>
                      <p className="text-slate-300 text-sm">Dealer: {table.dealer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${statusColors[table.status]}`}>
                      <i className={`fas ${statusIcons[table.status]} mr-1`}></i>
                      {table.status === 'active' ? 'Active' : table.status === 'full' ? 'Full' : 'Starting Soon'}
                    </div>
                    {table.waitlistCount > 0 && (
                      <div className="text-yellow-400 text-xs">Waitlist: {table.waitlistCount}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="text-slate-400 text-xs font-medium mb-1">BLINDS</div>
                    <div className="text-white font-bold">{table.blinds}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="text-slate-400 text-xs font-medium mb-1">MIN BUY-IN</div>
                    <div className="text-white font-bold">${table.minBuyIn}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="text-slate-400 text-xs font-medium mb-1">PLAYERS</div>
                    <div className="text-white font-bold">{table.players}/{table.maxPlayers}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="text-slate-400 text-xs font-medium mb-1">RAKE</div>
                    <div className="text-white font-bold">${table.rake}</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {table.status === 'active' && table.players < table.maxPlayers && !isOnWaitlist && (
                    <button 
                      onClick={() => handleJoinTable(table.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex items-center justify-center space-x-2"
                    >
                      <i className="fas fa-play text-sm"></i>
                      <span>Join Table</span>
                    </button>
                  )}
                  
                  {table.status === 'full' && !isOnWaitlist && (
                    <button 
                      onClick={() => handleJoinWaitlist(table.id)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center space-x-2"
                    >
                      <i className="fas fa-list text-sm"></i>
                      <span>Join Waitlist</span>
                    </button>
                  )}
                  
                  {table.status === 'starting' && (
                    <button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 flex items-center justify-center space-x-2">
                      <i className="fas fa-clock text-sm"></i>
                      <span>Register</span>
                    </button>
                  )}
                  
                  {isOnWaitlist && (
                    <button 
                      onClick={() => handleLeaveWaitlist(table.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 flex items-center justify-center space-x-2"
                    >
                      <i className="fas fa-times text-sm"></i>
                      <span>Leave Waitlist</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20 shadow-lg text-center">
            <div className="text-white text-2xl font-bold">{tables.filter(t => t.status === 'active').length}</div>
            <div className="text-cyan-300 text-xs">Active Tables</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20 shadow-lg text-center">
            <div className="text-white text-2xl font-bold">{tables.reduce((sum, t) => sum + t.players, 0)}</div>
            <div className="text-cyan-300 text-xs">Total Players</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20 shadow-lg text-center">
            <div className="text-white text-2xl font-bold">{tables.reduce((sum, t) => sum + t.waitlistCount, 0)}</div>
            <div className="text-cyan-300 text-xs">On Waitlist</div>
          </div>
        </div>
      </div>

      {renderBottomNavigation()}
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-cyan-500/20 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <i className="fas fa-spade-suit text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Elite Poker Club</h1>
              <p className="text-cyan-300 text-xs">Welcome back, Alex</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-bell text-sm"></i>
            </button>
            <button className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
              <i className="fas fa-user text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24 px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Wallet Balance */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20 shadow-lg shadow-green-500/10">
            <div className="flex items-center justify-between mb-3">
              <i className="fas fa-wallet text-green-400 text-lg"></i>
              <span className="text-green-300 text-xs font-medium">BALANCE</span>
            </div>
            <div className="text-white text-2xl font-bold">$2,450</div>
            <div className="text-green-300 text-xs mt-1">+$150 today</div>
          </div>

          {/* VIP Tier */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20 shadow-lg shadow-orange-500/10">
            <div className="flex items-center justify-between mb-3">
              <i className="fas fa-crown text-orange-400 text-lg"></i>
              <span className="text-orange-300 text-xs font-medium">VIP TIER</span>
            </div>
            <div className="text-white text-xl font-bold">Gold</div>
            <div className="text-orange-300 text-xs mt-1">2,340 points</div>
          </div>

          {/* Active Tables */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20 shadow-lg shadow-red-500/10">
            <div className="flex items-center justify-between mb-3">
              <i className="fas fa-table text-red-400 text-lg"></i>
              <span className="text-red-300 text-xs font-medium">ACTIVE</span>
            </div>
            <div className="text-white text-2xl font-bold">12</div>
            <div className="text-red-300 text-xs mt-1">tables running</div>
          </div>

          {/* Online Players */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 shadow-lg shadow-purple-500/10">
            <div className="flex items-center justify-between mb-3">
              <i className="fas fa-users text-purple-400 text-lg"></i>
              <span className="text-purple-300 text-xs font-medium">ONLINE</span>
            </div>
            <div className="text-white text-2xl font-bold">84</div>
            <div className="text-purple-300 text-xs mt-1">players active</div>
          </div>
        </div>

        {/* KYC Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/20 shadow-lg shadow-yellow-500/10 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-id-card text-yellow-400 text-lg"></i>
              <div>
                <div className="text-white font-semibold">KYC Verification</div>
                <div className="text-yellow-300 text-sm">Pending Review</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-300 text-xs">In Progress</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-white text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex items-center justify-center space-x-2 !rounded-button cursor-pointer">
              <i className="fas fa-list text-sm"></i>
              <span>Join Waitlist</span>
            </button>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center space-x-2 !rounded-button cursor-pointer">
              <i className="fas fa-plus text-sm"></i>
              <span>Deposit</span>
            </button>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center space-x-2 !rounded-button cursor-pointer">
              <i className="fas fa-credit-card text-sm"></i>
              <span>Request Credit</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('kyc')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center space-x-2 !rounded-button cursor-pointer"
            >
              <i className="fas fa-upload text-sm"></i>
              <span>Upload KYC</span>
            </button>
          </div>
          <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 flex items-center justify-center space-x-2 !rounded-button cursor-pointer">
            <i className="fas fa-money-bill-wave text-sm"></i>
            <span>Cash Out</span>
          </button>
        </div>
      </div>

      {renderBottomNavigation()}
    </div>
  );

  return (
    <div className="font-sans">
      <style>{`
        .!rounded-button {
          border-radius: 16px !important;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      {/* Debug Info */}
      <div className="fixed top-20 right-4 bg-black/50 text-white p-2 rounded text-xs z-50">
        Current: {currentScreen}
      </div>
      
      {currentScreen === 'login' && renderLoginScreen()}
      {currentScreen === 'clubCode' && renderClubCodeScreen()}
      {currentScreen === 'dashboard' && renderDashboard()}
      {currentScreen === 'tables' && renderTablesScreen()}
      {currentScreen === 'wallet' && renderWalletScreen()}
      {currentScreen === 'chat' && renderChatScreen()}
      {currentScreen === 'profile' && renderProfileScreen()}
      {currentScreen === 'kyc' && renderKYCScreen()}
    </div>
  );
};

export default App;

