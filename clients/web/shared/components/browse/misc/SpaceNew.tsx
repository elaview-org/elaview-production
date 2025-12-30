// // src/components/browse/SpaceDetailsSidebar.tsx - CONDENSED VERSION
// "use client";

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   X, MapPin, Star, Calendar, DollarSign, Check, AlertCircle, Loader2, Plus, 
//   ChevronDown, ChevronLeft, ChevronRight, Ruler, Eye, TrendingUp
// } from 'lucide-react';
// import { api } from '~/trpc/react';
// import { DatePickerModal } from '~/components/ui/DatePickerModal';

// interface Space {
//   id: string;
//   title: string;
//   description?: string;
//   type: string;
//   address: string;
//   city: string;
//   state: string;
//   latitude: number;
//   longitude: number;
//   pricePerDay: number;
//   installationFee?: number;
//   minDuration?: number;
//   maxDuration?: number;
//   width?: number;
//   height?: number;
//   dimensionsText?: string;
//   traffic?: string;
//   availableFrom?: Date;
//   availableTo?: Date;
//   images: string[];
//   owner: {
//     id: string;
//     name?: string;
//     email: string;
//   };
//   _count: {
//     bookings: number;
//     reviews: number;
//   };
//   averageRating?: number;
// }

// interface ConfirmedBooking {
//   id: string;
//   startDate: Date;
//   endDate: Date;
//   status: string;
// }

// interface SpaceDetailsSidebarProps {
//   space: Space;
//   campaignId: string | null;
//   isInCart: boolean;
//   cartDates?: {
//     startDate: Date;
//     endDate: Date;
//   };
//   onClose: () => void;
//   onSuccess: () => void;
//   onCreateCampaign?: () => void;
//   isPublicView?: boolean;
//   onAuthRequired?: () => void;
// }

// const SPACE_TYPE_LABELS: Record<string, string> = {
//   BILLBOARD: 'Billboard',
//   STOREFRONT: 'Storefront',
//   TRANSIT: 'Transit Advertising',
//   DIGITAL_DISPLAY: 'Digital Display',
//   WINDOW_DISPLAY: 'Window Display',
//   VEHICLE_WRAP: 'Vehicle Wrap',
//   OTHER: 'Other',
// };

// export const SpaceDetailsSidebar: React.FC<SpaceDetailsSidebarProps> = ({
//   space,
//   campaignId,
//   isInCart,
//   cartDates,
//   onClose,
//   onSuccess,
//   onCreateCampaign,
//   isPublicView = false,
//   onAuthRequired,
// }) => {
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [dateError, setDateError] = useState<string>('');
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [showDescription, setShowDescription] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const [isDateModalOpen, setIsDateModalOpen] = useState(false);

//   const { data: confirmedBookings, isLoading: loadingBookings } = api.spaces.getConfirmedBookings.useQuery({
//     spaceId: space.id,
//   });

//   // Initialize dates
//   useEffect(() => {
//     if (cartDates) {
//       console.log('📅 SpaceDetailsSidebar: Setting dates from cart', cartDates);
//       setStartDate(cartDates.startDate);
//       setEndDate(cartDates.endDate);
//     } else {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);
//       tomorrow.setHours(0, 0, 0, 0);
      
//       const weekLater = new Date(tomorrow);
//       weekLater.setDate(weekLater.getDate() + 7);

//       console.log('📅 SpaceDetailsSidebar: Setting default dates', { tomorrow, weekLater });
//       setStartDate(tomorrow);
//       setEndDate(weekLater);
//     }
//   }, [cartDates]);

//   // Date validation
//   const isDateAvailable = (date: Date): boolean => {
//     if (space.availableFrom) {
//       const availFrom = new Date(space.availableFrom);
//       availFrom.setHours(0, 0, 0, 0);
//       if (date < availFrom) return false;
//     }

//     if (space.availableTo) {
//       const availTo = new Date(space.availableTo);
//       availTo.setHours(23, 59, 59, 999);
//       if (date > availTo) return false;
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     if (date < today) return false;

//     const isBooked = confirmedBookings?.some((booking: ConfirmedBooking) => {
//       const bookingStart = new Date(booking.startDate);
//       const bookingEnd = new Date(booking.endDate);
//       bookingStart.setHours(0, 0, 0, 0);
//       bookingEnd.setHours(23, 59, 59, 999);
      
//       const checkDate = new Date(date);
//       checkDate.setHours(0, 0, 0, 0);

//       return checkDate >= bookingStart && checkDate <= bookingEnd;
//     });

//     return !isBooked;
//   };

//   // Validate selected dates
//   useEffect(() => {
//     if (!startDate || !endDate) {
//       setDateError('Both dates are required');
//       return;
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (startDate < today) {
//       setDateError('Start date must be in the future');
//       return;
//     }

//     if (endDate <= startDate) {
//       setDateError('End date must be after start date');
//       return;
//     }

//     const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
//     if (space.minDuration && duration < space.minDuration) {
//       setDateError(`Minimum booking duration is ${space.minDuration} days`);
//       return;
//     }

//     if (space.maxDuration && duration > space.maxDuration) {
//       setDateError(`Maximum booking duration is ${space.maxDuration} days`);
//       return;
//     }

//     const hasOverlap = confirmedBookings?.some((booking: ConfirmedBooking) => {
//       const bookingStart = new Date(booking.startDate);
//       const bookingEnd = new Date(booking.endDate);

//       return (
//         (startDate >= bookingStart && startDate <= bookingEnd) ||
//         (endDate >= bookingStart && endDate <= bookingEnd) ||
//         (startDate <= bookingStart && endDate >= bookingEnd)
//       );
//     });

//     if (hasOverlap) {
//       setDateError('Selected dates overlap with existing bookings');
//       return;
//     }

//     console.log('✅ SpaceDetailsSidebar: Dates validated successfully');
//     setDateError('');
//   }, [startDate, endDate, confirmedBookings, space.minDuration, space.maxDuration]);

//   const calculateDuration = () => {
//     if (!startDate || !endDate) return 0;
//     const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const calculateSquareFootage = () => {
//     if (space.width && space.height) {
//       return (space.width * space.height).toFixed(1);
//     }
//     return null;
//   };

//   const duration = calculateDuration();
//   const pricePerDay = typeof space.pricePerDay === 'number' ? space.pricePerDay : 0;
//   const installationFee = typeof space.installationFee === 'number' ? space.installationFee : 0;
//   const rentalCost = duration * pricePerDay;
//   const platformFee = (rentalCost + installationFee) * 0.08;
//   const total = rentalCost + installationFee + platformFee;

//   const addToCartMutation = api.cart.addToCart.useMutation({
//     onSuccess: () => {
//       console.log('✅ SpaceDetailsSidebar: Space added to cart');
//       onSuccess();
//     },
//     onError: (error) => {
//       console.error('❌ SpaceDetailsSidebar: Failed to add to cart', error);
//     },
//   });

//   const handleAddToCart = () => {
//     if (!campaignId || !startDate || !endDate || dateError) {
//       console.log('⚠️ SpaceDetailsSidebar: Cannot add to cart - missing requirements');
//       return;
//     }

//     console.log('🛒 SpaceDetailsSidebar: Adding to cart', {
//       spaceId: space.id,
//       campaignId,
//       startDate: startDate.toISOString(),
//       endDate: endDate.toISOString(),
//     });

//     addToCartMutation.mutate({
//       spaceId: space.id,
//       campaignId,
//       startDate,
//       endDate,
//     });
//   };

//   const isAddDisabled = !campaignId || !startDate || !endDate || !!dateError || isInCart;

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % space.images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + space.images.length) % space.images.length);
//   };


//   return (
//     <>
//       {/* Sidebar */}
//       <motion.div
//         initial={{ x: '100%' }}
//         animate={{ x: 0 }}
//         exit={{ x: '100%' }}
//         transition={{ type: 'spring', damping: 30, stiffness: 300 }}
//         className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto z-50"
//       >
//         {/* Header with Close Button */}
//         <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
//           <div>
//             <h2 className="text-lg font-bold text-white truncate">{space.title}</h2>
//             <p className="text-xs text-slate-400">{SPACE_TYPE_LABELS[space.type] || space.type}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex-shrink-0"
//             aria-label="Close sidebar"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="p-4 space-y-4">
//           {/* Image Carousel */}
//           {space.images.length > 0 && (
//             <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 group">
//               <img
//                 src={space.images[currentImageIndex]}
//                 alt={`${space.title} - Image ${currentImageIndex + 1}`}
//                 className="w-full h-full object-cover"
//               />
              
//               {space.images.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900"
//                     aria-label="Previous image"
//                   >
//                     <ChevronLeft className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900"
//                     aria-label="Next image"
//                   >
//                     <ChevronRight className="h-5 w-5" />
//                   </button>
//                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
//                     {space.images.map((_, idx) => (
//                       <div
//                         key={idx}
//                         className={`h-1.5 rounded-full transition-all ${
//                           idx === currentImageIndex
//                             ? 'w-6 bg-white'
//                             : 'w-1.5 bg-white/50'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Price and Location */}
//           <div>
//             <div className="flex items-baseline gap-2 mb-2">
//               <span className="text-3xl font-bold text-white">${pricePerDay}</span>
//               <span className="text-sm text-slate-400">per day</span>
//             </div>
//             <div className="flex items-start gap-2 text-sm text-slate-400">
//               <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
//               <span>{space.city}, {space.state}</span>
//             </div>
//             {space.averageRating && space._count.reviews > 0 && (
//               <div className="flex items-center gap-2 mt-2">
//                 <div className="flex items-center gap-1 text-sm">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <span className="font-semibold text-white">{space.averageRating.toFixed(1)}</span>
//                 </div>
//                 <span className="text-xs text-slate-400">
//                   ({space._count.reviews} {space._count.reviews === 1 ? 'review' : 'reviews'})
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Compact Stat Pills - Horizontal Layout */}
//           <div className="flex flex-wrap gap-2">
//             {/* Dimensions */}
//             {(space.width && space.height) && (
//               <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg">
//                 <Ruler className="h-4 w-4 text-blue-400 flex-shrink-0" />
//                 <div className="text-xs">
//                   <p className="font-semibold text-white">{space.width}' × {space.height}'</p>
//                   <p className="text-slate-400">{calculateSquareFootage()} sq ft</p>
//                 </div>
//               </div>
//             )}

//             {/* Traffic */}
//             {space.traffic && (
//               <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg">
//                 <Eye className="h-4 w-4 text-green-400 flex-shrink-0" />
//                 <div className="text-xs">
//                   <p className="font-semibold text-white">{space.traffic}</p>
//                   <p className="text-slate-400">impressions/mo</p>
//                 </div>
//               </div>
//             )}

//             {/* Bookings/Reviews */}
//             {space._count.reviews > 0 && (
//               <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg">
//                 <TrendingUp className="h-4 w-4 text-purple-400 flex-shrink-0" />
//                 <div className="text-xs">
//                   <p className="font-semibold text-white">{space._count.reviews} reviews</p>
//                   <p className="text-slate-400">{space._count.bookings} bookings</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Date Selection Button */}
//           {!isPublicView && campaignId && (
//             <div className="space-y-2">
//               <button
//                 onClick={() => setIsDateModalOpen(true)}
//                 disabled={isInCart || loadingBookings}
//                 className="w-full flex items-center justify-between p-4 bg-slate-800 border-2 border-slate-700 hover:border-blue-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
//                     <Calendar className="h-5 w-5 text-blue-400" />
//                   </div>
//                   <div className="text-left">
//                     <p className="text-sm font-semibold text-white">Campaign Dates</p>
//                     {startDate && endDate ? (
//                       <p className="text-xs text-slate-400">
//                         {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                         {' - '}
//                         {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                       </p>
//                     ) : (
//                       <p className="text-xs text-slate-400">Click to select dates</p>
//                     )}
//                   </div>
//                 </div>
//                 {!isInCart && (
//                   <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
//                 )}
//               </button>

//               {startDate && endDate && !dateError && (
//                 <div className="text-xs text-center text-slate-400">
//                   {duration} {duration === 1 ? 'day' : 'days'} selected
//                 </div>
//               )}

//               {/* Date Error Message */}
//               {dateError && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex items-start gap-2 p-2.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg"
//                 >
//                   <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
//                   <span>{dateError}</span>
//                 </motion.div>
//               )}
//             </div>
//           )}

//           {/* Cost Breakdown */}
//           {!isPublicView && duration > 0 && !dateError && campaignId && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="bg-blue-500/10 rounded-xl p-4 space-y-2 border border-blue-500/20"
//             >
//               <div className="flex items-center gap-2 mb-2">
//                 <DollarSign className="h-4 w-4 text-blue-400" />
//                 <h3 className="text-sm font-bold text-blue-400">Cost Breakdown</h3>
//               </div>
              
//               <div className="space-y-1.5">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-blue-300">{duration} days × ${pricePerDay.toFixed(0)}</span>
//                   <span className="font-semibold text-blue-400">${rentalCost.toFixed(2)}</span>
//                 </div>
                
//                 {installationFee > 0 && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-blue-300">Installation</span>
//                     <span className="font-semibold text-blue-400">${installationFee.toFixed(2)}</span>
//                   </div>
//                 )}
                
//                 <div className="flex justify-between text-sm">
//                   <span className="text-blue-300">Platform fee (8%)</span>
//                   <span className="font-semibold text-blue-400">${platformFee.toFixed(2)}</span>
//                 </div>
                
//                 <div className="pt-2 mt-2 border-t border-blue-500/20 flex justify-between items-baseline">
//                   <span className="text-sm font-bold text-blue-400">Total</span>
//                   <span className="text-2xl font-bold text-blue-400">
//                     ${total.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* Primary CTA */}
//           <div className="space-y-2">
//             {isPublicView ? (
//               <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
//                 <AlertCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
//                 <p className="text-sm font-semibold text-blue-400 mb-1">
//                   Sign in to book this space
//                 </p>
//                 <p className="text-xs text-blue-300 mb-3">
//                   Create a free account to start building campaigns
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={onAuthRequired}
//                   className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md"
//                 >
//                   <Plus className="h-5 w-5 mr-2" />
//                   Sign In to Add to Campaign
//                 </motion.button>
//               </div>
//             ) : !campaignId ? (
//               <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
//                 <AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
//                 <p className="text-sm font-semibold text-amber-400 mb-1">
//                   Create a campaign first
//                 </p>
//                 <p className="text-xs text-amber-300 mb-3">
//                   You need a campaign to book spaces
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     onClose();
//                     onCreateCampaign?.();
//                   }}
//                   className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md text-sm"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create Campaign
//                 </motion.button>
//               </div>
//             ) : isInCart ? (
//               <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
//                 <Check className="h-5 w-5" />
//                 <span className="font-semibold">In Cart</span>
//               </div>
//             ) : (
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleAddToCart}
//                 disabled={isAddDisabled || addToCartMutation.isPending}
//                 className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:bg-slate-700 disabled:cursor-not-allowed font-semibold flex items-center justify-center shadow-md hover:shadow-lg"
//               >
//                 {addToCartMutation.isPending ? (
//                   <>
//                     <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                     Adding...
//                   </>
//                 ) : (
//                   'Add to Cart'
//                 )}
//               </motion.button>
//             )}
//           </div>

//           {/* Description - Collapsible */}
//           {space.description && (
//             <button
//               onClick={() => setShowDescription(!showDescription)}
//               className="w-full text-left"
//             >
//               <div className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
//                 <span className="text-sm font-medium text-white">About this space</span>
//                 <motion.div
//                   animate={{ rotate: showDescription ? 180 : 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <ChevronDown className="h-4 w-4 text-slate-400" />
//                 </motion.div>
//               </div>
//               {showDescription && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className="mt-2 p-3 text-sm text-slate-300 leading-relaxed bg-slate-800 rounded-lg border border-slate-700"
//                 >
//                   {space.description}
//                 </motion.div>
//               )}
//             </button>
//           )}

//           {/* Additional Details - Collapsible */}
//           <button
//             onClick={() => setShowDetails(!showDetails)}
//             className="w-full text-left"
//           >
//             <div className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
//               <span className="text-sm font-medium text-white">Additional details</span>
//               <motion.div
//                 animate={{ rotate: showDetails ? 180 : 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <ChevronDown className="h-4 w-4 text-slate-400" />
//               </motion.div>
//             </div>
//             {showDetails && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="mt-2 p-3 space-y-2 text-sm bg-slate-800 rounded-lg border border-slate-700"
//               >
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Full address</span>
//                   <span className="font-medium text-white text-right">{space.address}</span>
//                 </div>
//                 {space.minDuration && (
//                   <div className="flex justify-between">
//                     <span className="text-slate-400">Min duration</span>
//                     <span className="font-medium text-white">{space.minDuration} days</span>
//                   </div>
//                 )}
//                 {space.maxDuration && (
//                   <div className="flex justify-between">
//                     <span className="text-slate-400">Max duration</span>
//                     <span className="font-medium text-white">{space.maxDuration} days</span>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//           </button>
//         </div>
//       </motion.div>

//       {/* Date Picker Modal */}
//       <DatePickerModal
//         isOpen={isDateModalOpen}
//         onClose={() => setIsDateModalOpen(false)}
//         startDate={startDate}
//         endDate={endDate}
//         onDateChange={(start, end) => {
//           setStartDate(start);
//           setEndDate(end);
//         }}
//         minDate={new Date()}
//         filterDate={isDateAvailable}
//       />
//     </>
//   );
// };