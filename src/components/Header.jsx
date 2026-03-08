import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { logoutUser } from '../services/firebase';
import { Moon, Sun, Plus, Zap, LogOut, Settings as SettingsIcon, User, MessageSquare, Crown, CreditCard, FileText, ChevronDown } from 'lucide-react';

const Header = () => {
    const location = useLocation();
    const theme = useAppStore((state) => state.theme);
    const toggleTheme = useAppStore((state) => state.toggleTheme);
    const openModal = useAppStore((state) => state.openModal);
    const user = useAppStore((state) => state.user);
    const cloudProvider = useAppStore((state) => state.cloudProvider);
    const userRole = useAppStore((state) => state.userRole);
    const canAdd = userRole === 'admin' || userRole === 'event_manager';

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const setUser = useAppStore((state) => state.setUser);

    const handleLogout = async () => {
        try {
            if (cloudProvider === 'firestore') {
                await logoutUser();
            }
            setUser(null);
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/events', label: 'Events' },
        { path: '/discovery', label: 'Discovery' },
        { path: '/calendar', label: 'Calendar' },
        { path: '/analytics', label: 'Analytics' }
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm px-safe">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-lg">
                                    <path d="M 4 4 L 4 20 L 9 20 L 9 14 L 14 14 L 19 20 L 23 20 L 17 13 C 21 12 22 9 21 6 C 20 4 18 3 14 3 L 4 3 L 4 4 Z M 9 7 L 13 7 C 15 7 16 8 16 9 C 16 10 15 11 13 11 L 9 11 L 9 7 Z" fill="#e67e22" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none tracking-widest uppercase">
                                    ED<span className="font-light opacity-70">DOT</span>
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
                                    {(!user || userRole === 'public') ? 'Public Edition' : 'Team Edition'}
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item) => (
                            item.onClick ? (
                                <button
                                    key={item.label}
                                    onClick={item.onClick}
                                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-1.5 sm:space-x-3">
                        {canAdd && (
                            <button
                                onClick={() => openModal('addEvent')}
                                className="btn btn-primary h-9 sm:h-10 px-2.5 sm:px-5 text-xs"
                                title="Add Event"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">Add Event</span>
                            </button>
                        )}

                        {userRole !== 'team_leader' && userRole !== 'admin' && (
                            <button
                                onClick={() => openModal('payment')}
                                className="h-9 sm:h-10 px-2.5 sm:px-5 text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-600 text-white rounded-lg sm:rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/20"
                                title="Upgrade to Team Edition"
                            >
                                <Zap size={16} fill="currentColor" />
                                <span className="hidden lg:inline">Upgrade</span>
                            </button>
                        )}

                        {userRole === 'team_leader' && (
                            <button
                                onClick={() => openModal('teamInvite')}
                                className="h-9 sm:h-10 px-2.5 sm:px-5 text-xs font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg sm:rounded-xl border border-emerald-200 dark:border-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                                title="Invite Team Members"
                            >
                                <User size={16} />
                                <span className="hidden sm:inline">Invite Team</span>
                            </button>
                        )}

                        <button
                            onClick={() => openModal('feedback')}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                            title="Give Feedback"
                        >
                            <MessageSquare size={20} />
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {user && (
                            <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-1.5 p-1 pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-95"
                                >
                                    <div className="w-8 h-8 rounded-lg outline-none bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 overflow-hidden relative">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={16} />
                                        )}
                                        {/* Crown indicator on avatar */}
                                        {(userRole === 'team_leader' || userRole === 'admin') && (
                                            <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 border-2 border-slate-50 dark:border-slate-800">
                                                <Crown size={8} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start pr-1">
                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 leading-tight max-w-[80px] truncate">
                                            {user.displayName || 'User'}
                                        </span>
                                        <span className="text-[8px] font-bold uppercase flex items-center gap-0.5 text-slate-400">
                                            {(userRole === 'team_leader' || userRole === 'admin') ? (
                                                <span className="text-amber-500 font-black tracking-wider flex items-center gap-0.5">TEAM</span>
                                            ) : (
                                                <span className="text-slate-400 tracking-wider">PUBLIC</span>
                                            )}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-indigo-500/10 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-[60]">
                                        <div className="px-4 py-2 mb-1 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.displayName || 'No Name'}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            to="/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-3"
                                        >
                                            <SettingsIcon size={16} className="text-slate-400" /> Account Settings
                                        </Link>

                                        {(userRole === 'public') ? (
                                            <button
                                                onClick={() => { setIsProfileOpen(false); openModal('payment'); }}
                                                className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-3 group"
                                            >
                                                <div className="w-6 h-6 rounded flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 group-hover:bg-indigo-600 transition-colors shrink-0">
                                                    <Crown size={12} className="text-indigo-600 group-hover:text-white transition-colors" />
                                                </div>
                                                <span>Subscribe (₹10/mo)</span>
                                            </button>
                                        ) : (
                                            <div className="px-4 py-2 flex items-center gap-3 bg-amber-50/50 dark:bg-amber-900/10">
                                                <div className="w-6 h-6 rounded flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 shrink-0">
                                                    <Crown size={12} className="text-amber-500" fill="currentColor" />
                                                </div>
                                                <span className="text-[10px] font-black tracking-widest uppercase text-amber-600 dark:text-amber-400">Team Edition</span>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => { setIsProfileOpen(false); openModal('legal'); }}
                                            className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-3"
                                        >
                                            <FileText size={16} className="text-slate-400" /> Legal Documents
                                        </button>

                                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                        <button
                                            onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                            className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 transition-colors flex items-center gap-3"
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};


export default Header;
