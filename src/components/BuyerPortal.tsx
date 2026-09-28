import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { BuyerProfile, MarketplaceCropListing, BuyerEnquiry } from '../types';
import { StorageService } from '../services/storageService';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Tag, 
  ShoppingBag,
  Send,
  X,
  Check
} from 'lucide-react';

interface Props {
  buyer: BuyerProfile;
  activeTab: 'home' | 'findcrops' | 'enquiries' | 'profile';
  onNavigateTab: (tab: any) => void;
}

export const BuyerPortal: React.FC<Props> = ({ buyer, activeTab, onNavigateTab }) => {
  const { t } = useLanguage();

  const [listings, setListings] = useState<MarketplaceCropListing[]>(() => 
    StorageService.getMarketplaceListings()
  );
  const [enquiries, setEnquiries] = useState<BuyerEnquiry[]>(() => 
    StorageService.getBuyerEnquiries(buyer.id)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListingForEnquiry, setSelectedListingForEnquiry] = useState<MarketplaceCropListing | null>(null);

  // Enquiry modal state
  const [offerPrice, setOfferPrice] = useState('');
  const [offerQuantity, setOfferQuantity] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Filter listings
  const filteredListings = listings.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.crop.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q)
    );
  });

  const handleOpenEnquiry = (listing: MarketplaceCropListing) => {
    setSelectedListingForEnquiry(listing);
    setOfferPrice(listing.pricePerKg.toString());
    setOfferQuantity((listing.expectedYieldKg * 0.5).toString());
    setOfferMessage(`Hello ${listing.farmerName}, we are interested in sourcing your ${listing.crop} from ${listing.landName}.`);
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForEnquiry) return;

    const newEnq = StorageService.addBuyerEnquiry({
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerBusiness: buyer.businessName,
      buyerContact: buyer.phoneOrEmail,
      listingId: selectedListingForEnquiry.id,
      crop: selectedListingForEnquiry.crop,
      offeredPricePerKg: parseFloat(offerPrice) || selectedListingForEnquiry.pricePerKg,
      quantityRequestedKg: parseFloat(offerQuantity) || 1000,
      message: offerMessage
    });

    setEnquiries([newEnq, ...enquiries]);
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setSelectedListingForEnquiry(null);
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Search Header for Home & Find Crops */}
      {(activeTab === 'home' || activeTab === 'findcrops') && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Direct Farmgate Mandi
              </span>
              <h2 className="text-xl font-black text-stone-900 mt-1">
                {activeTab === 'home' ? 'Available Farmgate Crops' : t('navFindCrops')}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, variety, or district..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* LISTINGS FEED (Home / Find Crops) */}
      {(activeTab === 'home' || activeTab === 'findcrops') && (
        <div className="grid grid-cols-1 gap-3">
          {filteredListings.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-stone-200 p-6">
              <p className="text-sm font-bold text-stone-600">No crops matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-amber-700 underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {listing.qualityGrade}
                      </span>
                      <h3 className="text-base font-black text-stone-900 mt-1">
                        {listing.crop}
                      </h3>
                      <p className="text-xs text-stone-500 font-semibold">{listing.variety}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-amber-700">
                        ₹{listing.pricePerKg.toFixed(2)}
                      </span>
                      <span className="block text-[11px] text-stone-400 font-medium">per kg</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{listing.district}, {listing.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Harvest: {listing.harvestDate}</span>
                    </div>
                  </div>

                  <div className="mt-2 p-2.5 rounded-2xl bg-stone-50 flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">Available Volume:</span>
                    <span className="font-bold text-stone-900">{listing.expectedYieldKg.toLocaleString()} kg</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                  <a
                    href={`tel:${listing.farmerPhone}`}
                    className="py-2.5 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Farmer</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenEnquiry(listing)}
                    className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Purchase Offer</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MY ENQUIRIES TAB */}
      {activeTab === 'enquiries' && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
            <h2 className="text-xl font-black text-stone-900">{t('navMyEnquiries')}</h2>
            <p className="text-xs text-stone-500 font-medium">Track your price quotes and farmer responses</p>
          </div>

          {enquiries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6">
              <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700">No purchase enquiries sent yet.</p>
              <p className="text-xs text-stone-400 mt-1">Browse farm listings and make your first offer directly to verified farmers.</p>
              <button
                type="button"
                onClick={() => onNavigateTab('home')}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Crops
              </button>
            </div>
          ) : (
            enquiries.map((enq) => (
              <div key={enq.id} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-stone-900">{enq.crop}</h3>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    enq.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : enq.status === 'Declined'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {enq.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold block">Offered Rate</span>
                    <span className="font-bold text-stone-900">₹{enq.offeredPricePerKg}/kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold block">Quantity</span>
                    <span className="font-bold text-stone-900">{enq.quantityRequestedKg.toLocaleString()} kg</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-medium italic">"{enq.message}"</p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                  <span>Enquiry Date: {enq.date}</span>
                  <span className="font-semibold text-stone-600">ID: #{enq.id.slice(-5)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ENQUIRY MODAL */}
      {selectedListingForEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900">Send Purchase Enquiry</h3>
                <p className="text-xs text-stone-500 font-medium">
                  {selectedListingForEnquiry.crop} • {selectedListingForEnquiry.farmerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedListingForEnquiry(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Your Offered Price (₹ per kg)
                </label>
                <input
                  type="number"
                  step="0.25"
                  required
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Quantity Required (kg)
                </label>
                <input
                  type="number"
                  required
                  value={offerQuantity}
                  onChange={(e) => setOfferQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Message / Pickup Notes
                </label>
                <textarea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              {enquirySuccess && (
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Enquiry sent successfully to farmer!</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedListingForEnquiry(null)}
                  className="w-1/3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-700/20"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
