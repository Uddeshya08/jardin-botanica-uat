'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Settings, Package, MapPin, CreditCard, LogOut, Plus, Trash2, Edit, X, Smartphone, University, Wallet, Check, AlertCircle, Heart, ShoppingBag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from 'app/components/ui/dialog';
import { Input } from 'app/components/ui/input';
import { Label } from 'app/components/ui/label';
import { Button } from 'app/components/ui/button';
import { ScrollArea } from 'app/components/ui/scroll-area';
import { Checkbox } from 'app/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from 'app/components/ui/radio-group';
import { toast } from 'sonner';
import { Navigation } from 'app/components/Navigation';

export default function ProfilePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('account-settings');
  const [emailComms, setEmailComms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: 'Rahul',
    lastName: 'Raghuvanshi',
    email: 'rahsrag@gmail.com'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editPaymentOpen, setEditPaymentOpen] = useState(false);
  const [deletePaymentOpen, setDeletePaymentOpen] = useState(false);
  const [deleteAddressOpen, setDeleteAddressOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [selectedDeleteAddress, setSelectedDeleteAddress] = useState<string | null>(null);
  const [editOfficeAddressOpen, setEditOfficeAddressOpen] = useState(false);
  const [deleteOfficeAddressOpen, setDeleteOfficeAddressOpen] = useState(false);
  const [editPayment2Open, setEditPayment2Open] = useState(false);
  const [deletePayment2Open, setDeletePayment2Open] = useState(false);
  const [editPayment3Open, setEditPayment3Open] = useState(false);
  const [deletePayment3Open, setDeletePayment3Open] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: 'credit', // credit, debit, upi
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    isDefault: false
  });
  const [newAddress, setNewAddress] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    label: 'Home', // Home, Office, Other
    isDefault: false
  });
  const [savedAddresses, setSavedAddresses] = useState<Array<{
    id: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    label: string;
    isDefault: boolean;
  }>>([
    {
      id: 'home-default',
      name: 'Rahul Raghuvanshi',
      addressLine1: '123 Garden Street, Botanical District',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210',
      label: 'Home',
      isDefault: true
    }
  ]);
  const [orders, setOrders] = useState<any[]>([]);
const [ordersLoading, setOrdersLoading] = useState(false);
const [ordersError, setOrdersError] = useState<string | null>(null);

useEffect(() => {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem("medusa_order_ids");
  if (!raw) return;

  let orderIds: string[] = [];
  try {
    orderIds = JSON.parse(raw); // we stored an array
  } catch {
    // if somehow a single id was stored as a string
    orderIds = raw ? [raw] : [];
  }

  if (orderIds.length === 0) return;

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const base = process.env.NEXT_PUBLIC_BASE_URL;

      const results = await Promise.all(
        orderIds.map(async (id) => {
          const res = await fetch(`${base}/store/orders/${id}`, {
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key":
                process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
            credentials: "include",
          });

          if (!res.ok) {
            return null; // don't break all, just skip this one
          }

          const data = await res.json();
          return data.order ?? null;
        })
      );

      const cleaned = results.filter(Boolean) as any[];
      setOrders(cleaned);
    } catch (err: any) {
      console.error(err);
      setOrdersError(err?.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  fetchOrders();
}, []);


  
  // Set page metadata and scroll detection
  useEffect(() => {
    document.title = "Profile | Jardin Botanica"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Manage your account settings, orders, addresses, and payment methods at Jardin Botanica. Update your personal information and preferences."
      )
    }
  }, [])

  // Handle scroll detection for navigation styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    
    // Check initial scroll position
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  const [favorites, setFavorites] = useState<Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
  }>>([]);
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('250ml');
  const [selectedFavoriteItem, setSelectedFavoriteItem] = useState<{
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
  } | null>(null);

  const sidebarItems = [
    { id: 'account-settings', label: 'Account Settings', icon: Settings },
    { id: 'order-history', label: 'Orders', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'address-book', label: 'Saved Addresses', icon: MapPin },
    { id: 'credit-cards', label: 'Payment Methods', icon: CreditCard },
  ];

  const handleSaveUserInfo = async () => {
    setLoading('userInfo');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(null);
    setEditInfoOpen(false);
    toast.success('Personal information updated successfully');
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading('password');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(null);
    setChangePasswordOpen(false);
    setPasswordData({currentPassword: '', newPassword: '', confirmPassword: ''});
    toast.success('Password updated successfully');
  };

  const handleSaveAddress = async () => {
    setLoading('address');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Add the new address to savedAddresses
    const addressToAdd = {
      id: `address-${Date.now()}`,
      ...newAddress
    };
    setSavedAddresses(prev => [...prev, addressToAdd]);
    
    setLoading(null);
    setAddAddressOpen(false);
    setNewAddress({name: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', phone: '', label: 'Home', isDefault: false});
    toast.success('Address saved successfully');
  };

  const handleDeleteAddress = async (addressId: string, addressLabel: string) => {
    setLoading('deleteAddress');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Remove address from savedAddresses
    setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
    
    setLoading(null);
    setDeleteAddressOpen(false);
    setDeleteOfficeAddressOpen(false);
    setSelectedDeleteAddress(null);
    toast.success(`${addressLabel} address deleted successfully`);
  };

  const handleDeletePayment = async (paymentType: string) => {
    setLoading('deletePayment');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    setLoading(null);
    setDeletePaymentOpen(false);
    setDeletePayment2Open(false);
    setDeletePayment3Open(false);
    setSelectedPaymentId(null);
    toast.success(`${paymentType} removed successfully`);
  };

  const handleAddPayment = async () => {
    setLoading('addPayment');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(null);
    setAddPaymentOpen(false);
    setNewPayment({
      type: 'credit',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      upiId: '',
      isDefault: false
    });
    toast.success('Payment method added successfully');
  };

  const handleSaveCommunicationPrefs = async () => {
    setLoading('commPrefs');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(null);
    toast.success('Communication preferences updated successfully');
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // Smooth scroll to top of content area
    const contentArea = document.querySelector('.account-content');
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCartClick = (item: {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
  }) => {
    // Check if this is the botanical hand wash
    if (item.id === 'botanical-hand-wash') {
      setSelectedFavoriteItem(item);
      setSelectedSize('250ml');
      setSizeDialogOpen(true);
    } else {
      // For other items, add directly to cart
      toast.success('Added to cart');
    }
  };

  const handleConfirmAddToCart = () => {
    if (selectedFavoriteItem) {
      // Calculate price based on selected size
      const basePrice = 1950;
      const finalPrice = selectedSize === '500ml' ? Math.round(basePrice * 1.5) : basePrice;
      
      // Create a modified item with size information
      const itemToAdd = {
        ...selectedFavoriteItem,
        id: `${selectedFavoriteItem.id}-${selectedSize}`,
        name: `${selectedFavoriteItem.name} (${selectedSize})`,
        price: finalPrice
      };
      
      toast.success('Added to cart');
    }
    setSizeDialogOpen(false);
    setSelectedFavoriteItem(null);
  };

  const renderActiveSection = () => {
    const sectionVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    switch (activeSection) {
      case 'account-settings':
        return (
          <motion.div
            key="account-settings"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="font-american-typewriter text-2xl lg:text-3xl mb-8 lg:mb-16 text-black">Account Settings</h1>

            {/* Two-column layout: Account Information (left) and Communication Preferences (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Account Information - Left Column */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <h2 className="font-din-arabic text-lg lg:text-xl mb-6 lg:mb-8 text-black tracking-wide">Personal information</h2>
                
                <div className="space-y-8 mb-8">
                  <div
                  >
                    <label className="font-din-arabic block text-sm text-black/50 mb-3 tracking-wide">Name</label>
                    <p className="font-din-arabic text-xl text-black tracking-wide">{userInfo.firstName} {userInfo.lastName}</p>
                  </div>
                  
                  <div>
                    <label className="font-din-arabic block text-sm text-black/50 mb-3 tracking-wide">Email address</label>
                    <p className="font-din-arabic text-xl text-black tracking-wide">{userInfo.email}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Dialog open={editInfoOpen} onOpenChange={setEditInfoOpen}>
                    <DialogTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-center"
                        style={{ borderColor: '#D8D2C7' }}
                      >
                        Edit Information
                      </motion.button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#e3e3d8' }}>
                      <DialogHeader className="pb-6">
                        <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">Edit Information</DialogTitle>
                        <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                          Update your personal information and contact details.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-96 pr-4">
                        <div className="space-y-6">
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">First Name</Label>
                            <Input
                              value={userInfo.firstName}
                              onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                          </div>
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Last Name</Label>
                            <Input
                              value={userInfo.lastName}
                              onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                          </div>
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Email Address</Label>
                            <Input
                              value={userInfo.email}
                              onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                          </div>
                        </div>
                      </ScrollArea>
                      <div className="flex space-x-3 pt-4 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSaveUserInfo}
                          className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                          style={{ borderColor: '#D8D2C7' }}
                        >
                          Save Changes
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEditInfoOpen(false)}
                          className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                          style={{ borderColor: '#D8D2C7' }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                    <DialogTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-center"
                        style={{ borderColor: '#D8D2C7' }}
                      >
                        Change Password
                      </motion.button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#e3e3d8' }}>
                      <DialogHeader className="pb-6">
                        <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">Change Password</DialogTitle>
                        <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                          Update your account password for enhanced security.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-96 pr-4">
                        <div className="space-y-6">
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Current Password</Label>
                            <Input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                          </div>
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">New Password</Label>
                            <Input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                          </div>
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Confirm New Password</Label>
                            <Input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 mt-2 text-red-600"
                              >
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-din-arabic text-sm tracking-wide">Passwords do not match</span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </ScrollArea>
                      <div className="flex space-x-3 pt-4 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleChangePassword}
                          disabled={loading === 'password' || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                          className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                          style={{ borderColor: '#D8D2C7' }}
                        >
                          {loading === 'password' ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full mx-auto"
                            />
                          ) : (
                            'Save Changes'
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setChangePasswordOpen(false);
                            setPasswordData({currentPassword: '', newPassword: '', confirmPassword: ''});
                          }}
                          className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                          style={{ borderColor: '#D8D2C7' }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>

              {/* Communication Preferences - Right Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="font-din-arabic text-lg lg:text-xl mb-6 lg:mb-8 text-black tracking-wide">Communication preferences</h2>
                
                <div className="space-y-6 mb-8">
                  <label 
                    className="flex items-start space-x-4 cursor-pointer group"
                  >
                    <Checkbox
                      checked={emailComms}
                      onCheckedChange={setEmailComms}
                      className="mt-1"
                    />
                    <span className="font-din-arabic text-sm text-black tracking-wide group-hover:text-black/70 transition-colors">
                      Email updates — order details and occasional notes from the Lab
                    </span>
                  </label>
                  
                  <label 
                    className="flex items-start space-x-4 cursor-pointer group"
                  >
                    <Checkbox
                      checked={newsletter}
                      onCheckedChange={setNewsletter}
                      className="mt-1"
                    />
                    <span className="font-din-arabic text-sm text-black tracking-wide group-hover:text-black/70 transition-colors">
                      Newsletter — the Journal, in your inbox
                    </span>
                  </label>
                </div>
                
                <p className="font-din-arabic text-sm text-black/40 tracking-wide leading-relaxed" style={{ marginBottom: '1.26rem' }}>
                  For details on how we handle your data, please see our <button className="underline hover:text-black/60 transition-colors">Privacy Policy</button>
                </p>

                <button
                  onClick={handleSaveCommunicationPrefs}
                  className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-center"
                  style={{ borderColor: '#D8D2C7' }}
                >
                  Save Preferences
                </button>
              </motion.div>
            </div>
          </motion.div>
        );

      case "order-history":
  return (
    <motion.div
      key="order-history"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="font-american-typewriter text-2xl lg:text-3xl mb-8 lg:mb-16 text-black">
        Orders
      </h1>

      {ordersLoading && (
        <p className="font-din-arabic text-black/60">Loading your orders…</p>
      )}

      {ordersError && (
        <p className="font-din-arabic text-red-600">{ordersError}</p>
      )}

      {!ordersLoading && !ordersError && orders.length === 0 && (
        <p className="font-din-arabic text-black/60">
          No orders found. Place an order first.
        </p>
      )}

      {!ordersLoading && !ordersError && orders.length > 0 && (
        <div className="space-y-8 lg:space-y-12">
          {orders.map((order: any, index: number) => (
            <motion.div
              key={order.id}
              className={`py-8 ${index < orders.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: "#D8D2C7" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start mb-6 gap-6 sm:gap-12">
                <div className="flex-1">
                  <h3 className="font-din-arabic text-xl text-black tracking-wide mb-1">
                    #{order.display_id ?? order.id}
                  </h3>
                  <p className="font-din-arabic text-base text-black/50 tracking-wide">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : ""}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="font-din-arabic text-xl text-black tracking-wide mb-2">
                    ₹{(order.total || 0) / 100}
                  </p>
                  <span className="font-din-arabic text-sm tracking-wide text-black/50">
                    {order.status ?? "completed"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                    style={{ borderColor: "rgba(0,0,0,0.05)" }}
                  >
                    <div>
                      <p className="font-din-arabic text-black">
                        {item.title}
                        {item.variant?.title ? ` – ${item.variant.title}` : ""}
                      </p>
                      <p className="font-din-arabic text-black/50 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-din-arabic text-black">
                      ₹{(item.unit_price * item.quantity) / 100}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between">
                <span className="font-din-arabic text-black/70">Total</span>
                <span className="font-din-arabic text-black text-lg">
                  ₹{(order.total || 0) / 100}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );



      case 'favorites':
        return (
          <motion.div
            key="favorites"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between mb-8 lg:mb-16">
              <div>
                <h1 className="font-american-typewriter text-2xl lg:text-3xl text-black">Your Favorites</h1>
                <p className="font-din-arabic text-base text-black/60 tracking-wide mt-2">
                  {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            {favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center"
                >
                  <Heart className="w-12 h-12 text-black/30" />
                </motion.div>
                <p className="font-din-arabic text-black/60 mb-8 max-w-md mx-auto" style={{ letterSpacing: '0.1em' }}>
                  Nothing here yet. Your favorites will appear as you wander the Botanist's Lab.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSectionChange('account-settings')}
                  className="px-8 py-3 bg-black text-white font-din-arabic tracking-wide hover:bg-black/90 transition-colors"
                  style={{ letterSpacing: '0.1em' }}
                >
                  Browse the Collection →
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {favorites.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setFavorites(favorites.filter(f => f.id !== item.id))}
                        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="w-4 h-4 fill-current" style={{ color: '#e58a4d' }} />
                      </motion.button>

                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.3 }}
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        <h3 className="font-american-typewriter mb-1" style={{ letterSpacing: '0.05em' }}>
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="font-din-arabic text-sm text-black/60 mb-3 line-clamp-1" style={{ letterSpacing: '0.1em' }}>
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-din-arabic whitespace-nowrap" style={{ letterSpacing: '0.1em' }}>
                            ₹{item.price.toLocaleString()}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToCartClick(item)}
                            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg font-din-arabic text-sm hover:bg-black/90 transition-colors whitespace-nowrap"
                            style={{ letterSpacing: '0.1em' }}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        );

      case 'address-book':
        return (
          <motion.div
            key="address-book"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="font-american-typewriter text-3xl mb-16 text-black">Saved Addresses</h1>
            
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Dialog open={addAddressOpen} onOpenChange={setAddAddressOpen}>
                <DialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-center"
                    style={{ borderColor: '#D8D2C7' }}
                  >
                    Add Address
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg" style={{ backgroundColor: '#e3e3d8' }}>
                  <DialogHeader className="pb-6">
                    <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">Add New Address</DialogTitle>
                    <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                      Add a new delivery address to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-72 pr-4">
                    <div className="space-y-4">
                      {[
                        { key: 'name', label: 'Full Name' },
                        { key: 'addressLine1', label: 'Address Line 1' },
                        { key: 'addressLine2', label: 'Address Line 2 (Optional)' },
                        { key: 'city', label: 'City' },
                        { key: 'state', label: 'State' },
                        { key: 'pincode', label: 'PIN Code' },
                        { key: 'phone', label: 'Phone' }
                      ].map((field, index) => (
                        <motion.div
                          key={field.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={field.key === 'city' || field.key === 'state' || field.key === 'pincode' || field.key === 'phone' ? 'grid grid-cols-2 gap-4' : ''}
                        >
                          {field.key === 'city' || field.key === 'state' || field.key === 'pincode' || field.key === 'phone' ? (
                            // Grid items for city/state and pincode/phone
                            field.key === 'city' || field.key === 'pincode' ? (
                              <>
                                <div>
                                  <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                                    {field.key === 'city' ? 'City' : 'PIN Code'}
                                  </Label>
                                  <Input
                                    value={newAddress[field.key as keyof typeof newAddress] as string}
                                    onChange={(e) => setNewAddress({...newAddress, [field.key]: e.target.value})}
                                    className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                    style={{ borderColor: '#D8D2C7' }}
                                  />
                                </div>
                                <div>
                                  <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                                    {field.key === 'city' ? 'State' : 'Phone'}
                                  </Label>
                                  <Input
                                    value={newAddress[field.key === 'city' ? 'state' : 'phone'] as string}
                                    onChange={(e) => setNewAddress({...newAddress, [field.key === 'city' ? 'state' : 'phone']: e.target.value})}
                                    className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                    style={{ borderColor: '#D8D2C7' }}
                                  />
                                </div>
                              </>
                            ) : null
                          ) : (
                            <>
                              <Label className="font-din-arabic text-sm text-black/60 tracking-wide">{field.label}</Label>
                              <Input
                                value={newAddress[field.key as keyof typeof newAddress] as string}
                                onChange={(e) => setNewAddress({...newAddress, [field.key]: e.target.value})}
                                className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                style={{ borderColor: '#D8D2C7' }}
                              />
                            </>
                          )}
                        </motion.div>
                      ))}
                      {/* Address Label Selector */}
                      <div>
                        <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Address Label</Label>
                        <select
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                          className="mt-2 w-full px-3 py-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10 focus:outline-none"
                          style={{ borderColor: '#D8D2C7' }}
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <motion.label 
                        className="flex items-center space-x-3 cursor-pointer"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                          className="w-4 h-4 border bg-transparent focus:ring-0 transition-all duration-200"
                          style={{ borderColor: '#D8D2C7' }}
                        />
                        <span className="font-din-arabic text-sm text-black/60 tracking-wide">Set as default address</span>
                      </motion.label>
                    </div>
                  </ScrollArea>
                  <div className="flex space-x-3 pt-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveAddress}
                      disabled={loading === 'address'}
                      className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                      style={{ borderColor: '#D8D2C7' }}
                    >
                      {loading === 'address' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full mx-auto"
                        />
                      ) : (
                        'Save Address'
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setAddAddressOpen(false);
                        setNewAddress({name: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', phone: '', label: 'Home', isDefault: false});
                      }}
                      className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                      style={{ borderColor: '#D8D2C7' }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            <div className="space-y-12">
              {/* Dynamically render saved addresses */}
              {savedAddresses.map((address, index) => (
                <motion.div 
                  key={address.id}
                  className="py-8 border-b" 
                  style={{ borderColor: '#D8D2C7' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex items-start mb-6 gap-12">
                    <div>
                      <h3 className="font-din-arabic text-xl text-black tracking-wide mb-2">{address.label}</h3>
                      {address.isDefault && (
                        <span className="font-din-arabic text-sm text-black/50 tracking-wide">Default address</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            className="p-3 border border-black/10 rounded hover:bg-black/5 transition-colors"
                            style={{ borderColor: '#D8D2C7' }}
                          >
                            <Edit className="w-5 h-5 text-black/60" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg" style={{ backgroundColor: '#e3e3d8' }}>
                          <DialogHeader className="pb-6">
                            <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">Edit Address</DialogTitle>
                            <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                              Update your address information and details.
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="max-h-72 pr-4">
                            <div className="space-y-4">
                              <div>
                                <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Full Name</Label>
                                <Input
                                  defaultValue={address.name}
                                  className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                  style={{ borderColor: '#D8D2C7' }}
                                />
                              </div>
                              <div>
                                <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Address Line 1</Label>
                                <Input
                                  defaultValue={address.addressLine1}
                                  className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                  style={{ borderColor: '#D8D2C7' }}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-din-arabic text-sm text-black/60 tracking-wide">City</Label>
                                  <Input
                                    defaultValue={address.city}
                                    className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                    style={{ borderColor: '#D8D2C7' }}
                                  />
                                </div>
                                <div>
                                  <Label className="font-din-arabic text-sm text-black/60 tracking-wide">PIN Code</Label>
                                  <Input
                                    defaultValue={address.pincode}
                                    className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                    style={{ borderColor: '#D8D2C7' }}
                                  />
                                </div>
                              </div>
                              {/* Address Label Selector */}
                              <div>
                                <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Address Label</Label>
                                <select
                                  defaultValue={address.label}
                                  className="mt-2 w-full px-3 py-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10 focus:outline-none"
                                  style={{ borderColor: '#D8D2C7' }}
                                >
                                  <option value="Home">Home</option>
                                  <option value="Office">Office</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                          </ScrollArea>
                          <div className="flex space-x-3 pt-4 mt-4">
                            <DialogTrigger asChild>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                                style={{ borderColor: '#D8D2C7' }}
                              >
                                Save Changes
                              </motion.button>
                            </DialogTrigger>
                            <DialogTrigger asChild>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                                style={{ borderColor: '#D8D2C7' }}
                              >
                                Cancel
                              </motion.button>
                            </DialogTrigger>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => setSelectedDeleteAddress(address.id)}
                            className="p-3 border border-black/10 rounded hover:bg-black/5 transition-colors"
                            style={{ borderColor: '#D8D2C7' }}
                          >
                            <Trash2 className="w-5 h-5 text-black/60" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#e3e3d8' }}>
                          <DialogHeader className="pb-6">
                            <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">Delete Address</DialogTitle>
                            <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                              Are you sure you want to delete this address? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDeleteAddress(address.id, address.label)}
                              disabled={loading === 'deleteAddress'}
                              className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                              style={{ borderColor: '#D8D2C7' }}
                            >
                              {loading === 'deleteAddress' ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full mx-auto"
                                />
                              ) : (
                                'Delete Address'
                              )}
                            </motion.button>
                            <DialogTrigger asChild>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedDeleteAddress(null)}
                                className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                                style={{ borderColor: '#D8D2C7' }}
                              >
                                Cancel
                              </motion.button>
                            </DialogTrigger>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="font-din-arabic text-lg text-black tracking-wide mb-2">{address.name}</p>
                    <p className="font-din-arabic text-base text-black/60 tracking-wide">{address.addressLine1}</p>
                    {address.addressLine2 && (
                      <p className="font-din-arabic text-base text-black/60 tracking-wide">{address.addressLine2}</p>
                    )}
                    <p className="font-din-arabic text-base text-black/60 tracking-wide">{address.city}, {address.state} - {address.pincode}</p>
                    <p className="font-din-arabic text-base text-black/60 tracking-wide">{address.phone}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'credit-cards':
        return (
          <motion.div
            key="credit-cards"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="font-american-typewriter text-3xl mb-16 text-black">Payment Methods</h1>
            
            <div className="space-y-12">
              {/* Credit Card 1 */}
              <motion.div 
                className="py-8 border-b" 
                style={{ borderColor: '#D8D2C7' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-start mb-6 gap-12">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="w-12 h-8 rounded border border-black/10 flex items-center justify-center" 
                      style={{ backgroundColor: '#e3e3d8', borderColor: '#D8D2C7' }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <CreditCard className="w-6 h-6 text-black/60" />
                    </motion.div>
                    <div>
                      <h3 className="font-din-arabic text-xl text-black tracking-wide mb-1">•••• •••• •••• 4321</h3>
                      <span className="font-din-arabic text-sm text-black/50 tracking-wide">Expires 12/25 • Default</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog open={editPaymentOpen} onOpenChange={setEditPaymentOpen}>
                      <DialogTrigger asChild>
                        <button
                          className="p-3 border border-black/10 rounded hover:bg-black/5 transition-colors"
                          style={{ borderColor: '#D8D2C7' }}
                        >
                          <Edit className="w-5 h-5 text-black/60" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#e3e3d8' }}>
                        <DialogHeader className="pb-6">
                          <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">Edit Payment Method</DialogTitle>
                          <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                            Update your payment method information.
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-72 pr-4">
                          <div className="space-y-6">
                            <div>
                              <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Card Number</Label>
                              <Input
                                defaultValue="•••• •••• •••• 4321"
                                className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                style={{ borderColor: '#D8D2C7' }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Expiry Date</Label>
                                <Input
                                  defaultValue="12/25"
                                  className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                  style={{ borderColor: '#D8D2C7' }}
                                />
                              </div>
                              <div>
                                <Label className="font-din-arabic text-sm text-black/60 tracking-wide">CVV</Label>
                                <Input
                                  defaultValue="123"
                                  type="password"
                                  className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                  style={{ borderColor: '#D8D2C7' }}
                                />
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                        <div className="flex space-x-3 pt-4 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setEditPaymentOpen(false)}
                            className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                            style={{ borderColor: '#D8D2C7' }}
                          >
                            Save Changes
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setEditPaymentOpen(false)}
                            className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                            style={{ borderColor: '#D8D2C7' }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={deletePaymentOpen} onOpenChange={setDeletePaymentOpen}>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setSelectedPaymentId('card1')}
                          className="p-3 border border-black/10 rounded hover:bg-black/5 transition-colors"
                          style={{ borderColor: '#D8D2C7' }}
                        >
                          <Trash2 className="w-5 h-5 text-black/60" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#e3e3d8' }}>
                        <DialogHeader className="pb-6">
                          <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">Delete Payment Method</DialogTitle>
                          <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                            Are you sure you want to delete this payment method? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDeletePayment('Credit card')}
                            disabled={loading === 'deletePayment'}
                            className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                            style={{ borderColor: '#D8D2C7' }}
                          >
                            {loading === 'deletePayment' ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full mx-auto"
                              />
                            ) : (
                              'Delete'
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setDeletePaymentOpen(false);
                              setSelectedPaymentId(null);
                            }}
                            className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                            style={{ borderColor: '#D8D2C7' }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Dialog open={addPaymentOpen} onOpenChange={setAddPaymentOpen}>
                <DialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                    style={{ borderColor: '#D8D2C7' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Payment Method
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#e3e3d8' }}>
                  <DialogHeader className="pb-6">
                    <DialogTitle className="font-american-typewriter text-2xl text-black tracking-wide">Add Payment Method</DialogTitle>
                    <DialogDescription className="font-din-arabic text-black/60 tracking-wide">
                      Add a new payment method to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-80 pr-4">
                    <div className="space-y-6">
                      {/* Payment Type Selection */}
                      <div>
                        <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Payment Type</Label>
                        <div className="mt-2 flex space-x-2">
                          {[
                            { value: 'credit', label: 'Credit Card', icon: CreditCard },
                            { value: 'debit', label: 'Debit Card', icon: CreditCard },
                            { value: 'upi', label: 'UPI', icon: Wallet }
                          ].map((type) => {
                            const Icon = type.icon;
                            return (
                              <motion.button
                                key={type.value}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setNewPayment({...newPayment, type: type.value})}
                                className={`flex-1 px-3 py-2 border rounded text-sm font-din-arabic tracking-wide transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap ${
                                  newPayment.type === type.value 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-transparent text-black hover:bg-black/5'
                                }`}
                                style={{ borderColor: newPayment.type === type.value ? '#000' : '#D8D2C7' }}
                              >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {type.label}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {newPayment.type === 'upi' ? (
                        // UPI Form
                        <>
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">UPI ID</Label>
                            <Input
                              value={newPayment.upiId}
                              onChange={(e) => setNewPayment({...newPayment, upiId: e.target.value})}
                              placeholder="yourname@upi"
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                          </div>
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Account Holder Name</Label>
                            <Input
                              value={newPayment.cardholderName}
                              onChange={(e) => setNewPayment({...newPayment, cardholderName: e.target.value})}
                              placeholder="Full name as per bank account"
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                          </div>
                        </>
                      ) : (
                        // Card Form
                        <>
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Card Number</Label>
                            <Input
                              value={newPayment.cardNumber}
                              onChange={(e) => setNewPayment({...newPayment, cardNumber: e.target.value})}
                              placeholder="1234 5678 9012 3456"
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Expiry Date</Label>
                              <Input
                                value={newPayment.expiryDate}
                                onChange={(e) => setNewPayment({...newPayment, expiryDate: e.target.value})}
                                placeholder="MM/YY"
                                className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                style={{ borderColor: '#D8D2C7' }}
                              />
                            </div>
                            <div>
                              <Label className="font-din-arabic text-sm text-black/60 tracking-wide">CVV</Label>
                              <Input
                                value={newPayment.cvv}
                                onChange={(e) => setNewPayment({...newPayment, cvv: e.target.value})}
                                placeholder="123"
                                type="password"
                                className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                                style={{ borderColor: '#D8D2C7' }}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="font-din-arabic text-sm text-black/60 tracking-wide">Cardholder Name</Label>
                            <Input
                              value={newPayment.cardholderName}
                              onChange={(e) => setNewPayment({...newPayment, cardholderName: e.target.value})}
                              placeholder="Full name as on card"
                              className="mt-2 bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10"
                              style={{ borderColor: '#D8D2C7' }}
                            />
                          </div>
                        </>
                      )}

                      <motion.label 
                        className="flex items-center space-x-3 cursor-pointer"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="checkbox"
                          checked={newPayment.isDefault}
                          onChange={(e) => setNewPayment({...newPayment, isDefault: e.target.checked})}
                          className="w-4 h-4 border bg-transparent focus:ring-0 transition-all duration-200"
                          style={{ borderColor: '#D8D2C7' }}
                        />
                        <span className="font-din-arabic text-sm text-black/60 tracking-wide">Set as default payment method</span>
                      </motion.label>
                    </div>
                  </ScrollArea>
                  <div className="flex space-x-3 pt-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddPayment}
                      disabled={loading === 'addPayment' || !newPayment.cardholderName || (newPayment.type === 'upi' ? !newPayment.upiId : !newPayment.cardNumber || !newPayment.expiryDate || !newPayment.cvv)}
                      className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 text-center"
                      style={{ borderColor: '#D8D2C7' }}
                    >
                      {loading === 'addPayment' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full mx-auto"
                        />
                      ) : (
                        'Add'
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setAddPaymentOpen(false);
                        setNewPayment({
                          type: 'credit',
                          cardNumber: '',
                          expiryDate: '',
                          cvv: '',
                          cardholderName: '',
                          upiId: '',
                          isDefault: false
                        });
                      }}
                      className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 text-center"
                      style={{ borderColor: '#D8D2C7' }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navigation isScrolled={isScrolled} />
      <div className="min-h-screen flex flex-col lg:flex-row pt-32 lg:pt-32" style={{ backgroundColor: '#e3e3d8' }}>
      {/* Mobile Header - Only show on mobile */}
      <div className="lg:hidden px-6 py-8 border-b" style={{ borderColor: '#D8D2C7' }}>
        <div className="text-center mb-6">
          <h2 className="font-american-typewriter text-2xl text-black tracking-wide">Hello, Rahul</h2>
          <p className="font-din-arabic text-sm text-black/50 tracking-wide mt-1">Manage your account and preferences</p>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile, shown as horizontal tabs */}
      <motion.div 
        className="hidden lg:block lg:w-96 border-r pr-12 pl-16 py-8" 
        style={{ borderColor: '#D8D2C7' }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Greeting */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="space-y-2 text-center">
            <h2 className="font-american-typewriter text-3xl text-black tracking-wide">Hello, Rahul</h2>
            <p className="font-din-arabic text-sm text-black/50 tracking-wide">Manage your account and preferences</p>
          </div>
        </motion.div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-din-arabic tracking-wide">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeSection === item.id ? 'rotate-90' : ''}`} />
              </motion.button>
            );
          })}
        </nav>
        
        <motion.div 
          className="mt-12 pt-8 border-t" 
          style={{ borderColor: '#D8D2C7' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-black hover:bg-black/5 rounded transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-din-arabic tracking-wide">Sign Out</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden px-4 py-4 border-b overflow-x-auto" style={{ borderColor: '#D8D2C7' }}>
        <div className="flex space-x-2 min-w-max">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-full whitespace-nowrap transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-black text-white'
                    : 'bg-white/50 text-black hover:bg-black/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-din-arabic tracking-wide text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 lg:py-12 px-6 lg:pl-16 lg:pr-6 account-content overflow-y-auto">
        <AnimatePresence mode="wait">
          {renderActiveSection()}
        </AnimatePresence>
      </div>

      {/* Size Selection Dialog */}
      <Dialog open={sizeDialogOpen} onOpenChange={setSizeDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-black/20" style={{ backgroundColor: '#e3e3d8' }}>
          <DialogHeader>
            <DialogTitle className="font-american-typewriter tracking-tight text-black" style={{ letterSpacing: '0.05em' }}>
              {selectedFavoriteItem?.name}
            </DialogTitle>
            <DialogDescription className="font-din-arabic text-black/70 leading-relaxed pt-2" style={{ letterSpacing: '0.1em' }}>
              {selectedFavoriteItem?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="font-din-arabic text-sm tracking-wider uppercase" style={{ color: '#a28b6f', letterSpacing: '0.15em' }}>
                Select Size
              </h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-col gap-3">
                <div className="flex items-center space-x-3 p-4 border border-black/20 hover:border-black/40 transition-colors cursor-pointer rounded-sm bg-white/30">
                  <RadioGroupItem value="250ml" id="size-250ml-account" className="border-black/30 text-black" />
                  <Label 
                    htmlFor="size-250ml-account" 
                    className="flex-1 font-din-arabic text-black cursor-pointer flex justify-between items-center"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    <span>250ml</span>
                    <span>₹1,950</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-black/20 hover:border-black/40 transition-colors cursor-pointer rounded-sm bg-white/30">
                  <RadioGroupItem value="500ml" id="size-500ml-account" className="border-black/30 text-black" />
                  <Label 
                    htmlFor="size-500ml-account" 
                    className="flex-1 font-din-arabic text-black cursor-pointer flex justify-between items-center"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    <span>500ml</span>
                    <span>₹2,925</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSizeDialogOpen(false)}
              className="font-din-arabic px-6 py-3 border border-black/30 text-black hover:bg-black/5 transition-all duration-300 tracking-wide flex-1 sm:flex-initial"
              style={{ letterSpacing: '0.1em' }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmAddToCart}
              className="font-din-arabic px-6 py-3 bg-black text-white hover:bg-black/90 transition-all duration-300 tracking-wide flex-1 sm:flex-initial"
              style={{ letterSpacing: '0.1em' }}
            >
              Add to Cart
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

