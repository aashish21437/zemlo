// app/add-sightseeings/page.js

'use server'

import { addSightseeing } from './actions';

export default async function AddSightseeingPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900">Sightseeing Master Entry</h1>
                    <p className="text-gray-600 mt-2">Populate the Japan Tourism Database (2026 Schema)</p>
                </header>

                <form action={addSightseeing} className="space-y-8">

                    {/* SECTION 1: WHO / WHAT - BASIC DETAILS */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-blue-600 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">1</span>
                                Who / What: Basic Details
                            </h2>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Naming & Translation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">English Name (name_en)</label>
                                    <input name="name_en" type="text" required placeholder="e.g. Kiyomizu-dera" className="w-full border-slate-200 border-2 p-3 rounded-xl focus:border-blue-500 outline-none transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Aliases (Comma separated)</label>
                                    <input name="aliases" type="text" placeholder="The Golden Pavilion, Kinkaku-ji" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>

                            {/* Classification & Categorization */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Primary Category</label>
                                    <select name="category_primary" className="w-full border-slate-200 border-2 p-3 rounded-xl bg-white">
                                        <option value="Temple">Temple</option>
                                        <option value="Shrine">Shrine</option>
                                        <option value="Museum">Museum</option>
                                        <option value="Park">Park</option>
                                        <option value="Castle">Castle</option>
                                        <option value="Observation Deck">Observation Deck</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Category Tags (Comma separated)</label>
                                    <input name="category_tags" type="text" placeholder="UNESCO, Garden, Historical, Hiking" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>

                            {/* Historical & Cultural Context */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Year Founded</label>
                                    <input name="year_founded" type="text" placeholder="e.g. 778" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Gov Status</label>
                                    <input name="government_status" type="text" placeholder="National Treasure" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div className="flex items-center space-x-3 pt-6">
                                    <input name="unesco_status" type="checkbox" className="w-6 h-6 accent-blue-600 cursor-pointer" />
                                    <label className="font-bold text-slate-700">UNESCO Site?</label>
                                </div>
                            </div>

                            {/* Descriptive Content */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Tagline (5-word hook)</label>
                                    <input name="tagline" type="text" placeholder="Tokyo's Oldest Buddhist Temple" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Short Description (Preview Card)</label>
                                    <textarea name="description_short" rows="2" className="w-full border-slate-200 border-2 p-3 rounded-xl"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Long Description (Full History)</label>
                                    <textarea name="description_long" rows="5" className="w-full border-slate-200 border-2 p-3 rounded-xl"></textarea>
                                </div>
                            </div>

                            {/* Identifiers & Media */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Internal Spot ID</label>
                                    <input name="spot_id" type="text" placeholder="e.g. TKY-001" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Google Place ID</label>
                                    <input name="external_id_google" type="text" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Primary Photo URL</label>
                                    <input name="primary_photo_url" type="url" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Gallery URLs (Comma separated)</label>
                                    <textarea name="gallery_urls" rows="2" placeholder="url1, url2, url3" className="w-full border-slate-200 border-2 p-3 rounded-xl"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Blog Links / External URLs (Comma separated)</label>
                                    <textarea name="external_page_urls" rows="2" className="w-full border-slate-200 border-2 p-3 rounded-xl"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: WHERE - LOCATION & COORDINATES */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-emerald-600 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">2</span>
                                Where: Location & Coordinates
                            </h2>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Administrative Hierarchy (The Political Path) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Prefecture</label>
                                    <input name="prefecture" type="text" placeholder="e.g. Tokyo, Kyoto, Osaka" required className="w-full border-slate-200 border-2 p-3 rounded-xl focus:border-emerald-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Municipality (City/Town/Village)</label>
                                    <input name="municipality" type="text" placeholder="e.g. Minato-ku, Kyoto-shi" required className="w-full border-slate-200 border-2 p-3 rounded-xl focus:border-emerald-500 outline-none transition-all" />
                                </div>
                            </div>

                            {/* The Address String (The Mailing Path) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Neighborhood (-cho / -machi)</label>
                                    <input name="neighborhood" type="text" placeholder="e.g. Ginza, Gion-machi" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Postal Code (7-digit)</label>
                                    <input name="postal_code" type="text" placeholder="e.g. 105-0011" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Block Number (-ban)</label>
                                    <input name="block_number" type="text" placeholder="e.g. 1-2-3" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Address (English order)</label>
                                    <input name="address_full_en" type="text" placeholder="Building Name, 1-2-3 Neighborhood, City, Prefecture" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>

                            {/* Digital Coordinates (The Map Path) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 p-4 bg-yellow-50/50 rounded-2xl">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Longitude (First for MongoDB)</label>
                                    <input name="lng" type="number" step="any" required placeholder="e.g. 139.767" className="w-full border-slate-200 border-2 p-3 rounded-xl focus:border-yellow-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Latitude</label>
                                    <input name="lat" type="number" step="any" required placeholder="e.g. 35.681" className="w-full border-slate-200 border-2 p-3 rounded-xl focus:border-yellow-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Elevation (Meters)</label>
                                    <input name="elevation_meters" type="number" placeholder="e.g. 333" className="w-full border-slate-200 border-2 p-3 rounded-xl bg-white" />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Plus Code (Google identifier)</label>
                                    <input name="plus_code" type="text" placeholder="e.g. GV2P+98 Sumida" className="w-full border-slate-200 border-2 p-3 rounded-xl bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* THE ADDRESS STRING */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">The Address String (The Mailing Path)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Neighborhood (-cho/-machi)</label>
                                <input name="neighborhood" type="text" placeholder="e.g. Gion-machi" className="mt-1 w-full border p-2 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Postal Code</label>
                                <input name="postal_code" type="text" placeholder="e.g. 605-0001" className="mt-1 w-full border p-2 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Block Number (-ban)</label>
                                <input name="block_number" type="text" placeholder="e.g. 1-2-3" className="mt-1 w-full border p-2 rounded-md" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-semibold text-gray-700">Full Address (English order)</label>
                                <input name="address_full_en" type="text" placeholder="1-2-3 Gion-machi, Kyoto-shi, Kyoto" className="mt-1 w-full border p-2 rounded-md" />
                            </div>
                        </div>
                    </section>

                    {/* DIGITAL COORDINATES */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Digital Coordinates (The Map Path)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Longitude</label>
                                <input name="lng" type="number" step="any" placeholder="135.772" required className="mt-1 w-full border p-2 rounded-md bg-yellow-50" />
                                <span className="text-xs text-gray-400">Must be first for MongoDB</span>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Latitude</label>
                                <input name="lat" type="number" step="any" placeholder="34.994" required className="mt-1 w-full border p-2 rounded-md bg-yellow-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Plus Code</label>
                                <input name="plus_code" type="text" placeholder="e.g. GV2P+98" className="mt-1 w-full border p-2 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Elevation (Meters)</label>
                                <input name="elevation" type="number" placeholder="e.g. 50" className="mt-1 w-full border p-2 rounded-md" />
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: HOW - ACCESS & TRANSPORTATION */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-violet-600 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-violet-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">3</span>
                                How: Access & Transportation
                            </h2>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Rail Access (The Primary Method) */}
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-violet-600 mb-4 flex items-center">
                                    <span className="mr-2">🚆</span> Rail Access
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Station Names & Codes</label>
                                        <input name="station_names_codes" type="text" placeholder="e.g. Shinjuku Station : M08, Harajuku Station : JY19" className="w-full border-slate-200 border-2 p-3 rounded-xl focus:border-violet-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Recommended Exit / Gate</label>
                                        <input name="recommended_exit_gate" type="text" placeholder="e.g. Exit A5, Hachiko Exit" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Walk Time (Minutes)</label>
                                        <input name="walk_time_min" type="number" placeholder="e.g. 5" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                    </div>
                                </div>
                            </div>

                            {/* Bus & Alternative Access */}
                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-wider text-violet-600 mb-4 flex items-center">
                                    <span className="mr-2">🚌</span> Bus Access
                                </h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Bus Stop Name</label>
                                    <input name="bus_stop_name" type="text" placeholder="e.g. Kinkakuji-michi Bus Stop" className="w-full border-slate-200 border-2 p-3 rounded-xl focus:border-violet-500 outline-none" />
                                </div>
                            </div>

                            {/* Road & Parking */}
                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-wider text-violet-600 mb-4 flex items-center">
                                    <span className="mr-2">🚗</span> Road & Parking (Rental/Taxi)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-3 p-4 border-2 border-slate-100 rounded-xl bg-slate-50">
                                        <input name="parking_available" type="checkbox" className="w-6 h-6 accent-violet-600 cursor-pointer" />
                                        <label className="font-bold text-slate-700">Parking Available?</label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Parking Fees</label>
                                        <input name="parking_fees" type="text" placeholder="e.g. 500 JPY/hr or Free" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                    </div>

                                    {/* Taxi Drop-off GeoJSON Point */}
                                    <div className="md:col-span-2 bg-violet-50 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-black text-violet-700 uppercase mb-2">Taxi Drop-off Point (GeoJSON)</label>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500">Taxi Drop Longitude</label>
                                            <input name="taxi_lng" type="number" step="any" placeholder="139.xxx" className="w-full border-slate-200 border-2 p-2 rounded-lg bg-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500">Taxi Drop Latitude</label>
                                            <input name="taxi_lat" type="number" step="any" placeholder="35.xxx" className="w-full border-slate-200 border-2 p-2 rounded-lg bg-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: TICKET TYPES & PRICING */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-amber-500 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-amber-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">4</span>
                                Ticket Types & Pricing
                            </h2>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* The Pricing Core (Age-Based Tiers) */}
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-amber-600 mb-4 flex items-center">
                                    <span className="mr-2">💴</span> Age-Based Tiers (JPY)
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Adult (18+)</label>
                                        <input name="adult_price" type="number" placeholder="¥" className="w-full border-slate-200 border-2 p-2 rounded-lg focus:border-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Senior (65+)</label>
                                        <input name="senior_price" type="number" placeholder="¥" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">High School</label>
                                        <input name="student_high_school_price" type="number" placeholder="¥" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Middle School</label>
                                        <input name="student_middle_school_price" type="number" placeholder="¥" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Elementary</label>
                                        <input name="student_elementary_price" type="number" placeholder="¥" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Infant (0-5)</label>
                                        <input name="infant_child_price" type="number" placeholder="¥" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic & Temporal Factors */}
                            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3 p-4 border-2 border-slate-100 rounded-xl bg-slate-50">
                                    <input name="is_dynamic_pricing" type="checkbox" className="w-6 h-6 accent-amber-500 cursor-pointer" />
                                    <div>
                                        <label className="font-bold text-slate-700 block">Dynamic Pricing?</label>
                                        <span className="text-xs text-slate-500">Price varies by date (e.g. Disney/USJ)</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Weekday Price</label>
                                        <input name="weekday_price" type="number" placeholder="¥" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Weekend/Holiday</label>
                                        <input name="weekend_holiday_price" type="number" placeholder="¥" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* Group & Membership Discounts */}
                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-wider text-amber-600 mb-4">👥 Group & Membership</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Group Min. Size</label>
                                        <input name="group_discount_min_size" type="number" placeholder="e.g. 20" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Group Rate (Per Person)</label>
                                        <input name="group_rate_per_person" type="number" placeholder="¥" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Membership Benefits</label>
                                        <input name="membership_benefits" type="text" placeholder="JAF, ICOM, Local ID" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Logistics */}
                            <div className="pt-6 border-t border-slate-100 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Payment Methods (Comma separated)</label>
                                        <input name="payment_methods" type="text" placeholder="Cash, Credit Card, Suica, PayPay" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Official Booking URL</label>
                                        <input name="official_booking_url" type="url" placeholder="https://..." className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                    <div className="flex items-center space-x-3 p-4 border-2 border-slate-100 rounded-xl bg-slate-50">
                                        <input name="advance_purchase_required" type="checkbox" className="w-6 h-6 accent-amber-500" />
                                        <label className="font-bold text-slate-700">Advance Purchase Required?</label>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Full Refund Before (Days)</label>
                                        <input name="fullrefund_before_day" type="number" placeholder="e.g. 7" className="w-full border-slate-200 border-2 p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Currency</label>
                                        <input name="currency" type="text" value="JPY" readOnly className="w-full border-slate-100 border-2 p-2 rounded-lg bg-slate-100 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: SCHEDULE & LOGISTICS */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-rose-500 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-rose-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">5</span>
                                Schedule & Logistics
                            </h2>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Daily Operating Hours */}
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-rose-600 mb-4 flex items-center">
                                    <span className="mr-2">⏰</span> Daily Operating Hours
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Opening Time</label>
                                        <input name="opening_time" type="time" className="w-full border-slate-200 border-2 p-3 rounded-xl focus:border-rose-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Closing Time</label>
                                        <input name="closing_time" type="time" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Last Entry Time (Crucial)</label>
                                        <input name="last_entry_time" type="time" className="w-full border-slate-200 border-2 p-3 rounded-xl bg-rose-50" />
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 border-2 border-slate-100 rounded-xl bg-slate-50 h-[52px]">
                                        <input name="is_24_hours" type="checkbox" className="w-6 h-6 accent-rose-500 cursor-pointer" />
                                        <label className="font-bold text-slate-700">Open 24 Hours?</label>
                                    </div>
                                </div>
                            </div>

                            {/* Regular Closures (The Holiday Logic) */}
                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-wider text-rose-600 mb-4 flex items-center">
                                    <span className="mr-2">🗓️</span> Regular Closures
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Regular Closed Days (Comma separated)</label>
                                        <input name="regular_closed_days" type="text" placeholder="e.g. Monday, New Year's Day" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Specific Opening Days (if seasonal)</label>
                                        <input name="opening_days" type="text" placeholder="e.g. Daily during Sakura Season" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                    </div>
                                </div>
                            </div>

                            {/* Visit Management */}
                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-wider text-rose-600 mb-4 flex items-center">
                                    <span className="mr-2">🎟️</span> Visit Management
                                </h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Entry System</label>
                                    <select name="entry_system" className="w-full border-slate-200 border-2 p-3 rounded-xl bg-white">
                                        <option value="First Come First Served">First Come First Served</option>
                                        <option value="Timed Entry">Timed Entry (Fixed Time Slots)</option>
                                        <option value="Numbered Ticket">Numbered Ticket (Seiriken) on arrival</option>
                                        <option value="Queue Only">Queue Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 6: FACILITIES & ACCESSIBILITY */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-cyan-600 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-cyan-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">6</span>
                                Facilities & Accessibility
                            </h2>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Universal Design & Mobility */}
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-cyan-700 mb-4 flex items-center">
                                    <span className="mr-2">♿</span> Universal Design & Mobility
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Wheelchair Access Level</label>
                                        <select name="wheelchair_access_level" className="w-full border-slate-200 border-2 p-3 rounded-xl bg-white">
                                            <option value="Full">Full (Barrier-free throughout)</option>
                                            <option value="Partial">Partial (Some stairs/gravel/steps)</option>
                                            <option value="None">None (Inaccessible for wheels)</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3 p-3 border-2 border-slate-100 rounded-xl bg-slate-50">
                                            <input name="elevator_availability" type="checkbox" className="w-6 h-6 accent-cyan-600 cursor-pointer" />
                                            <label className="font-bold text-slate-700 text-sm">Elevators?</label>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 border-2 border-slate-100 rounded-xl bg-slate-50">
                                            <input name="stepless_routes" type="checkbox" className="w-6 h-6 accent-cyan-600 cursor-pointer" />
                                            <label className="font-bold text-slate-700 text-sm">Stepless Paths?</label>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Rental Mobility Aids (Comma separated)</label>
                                        <input name="rental_mobility_aids" type="text" placeholder="Manual Wheelchair, Electric Scooter, Walking Stick" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                    </div>
                                </div>
                            </div>

                            {/* Inclusion & Tech */}
                            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-wider text-cyan-700 mb-4">🥗 Dietary Inclusion</h3>
                                    <div className="flex items-center space-x-3 p-4 border-2 border-slate-100 rounded-xl bg-slate-50">
                                        <input name="vegetarian_vegan_options" type="checkbox" className="w-6 h-6 accent-cyan-600" />
                                        <label className="font-bold text-slate-700">Vegetarian / Vegan Options?</label>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-wider text-cyan-700 mb-4">🎧 Tech & Connectivity</h3>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Audio Guide Languages (Comma separated)</label>
                                    <input name="audio_guide_languages" type="text" placeholder="English, Chinese, French, Spanish" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>

                            {/* Rules & Policies (The Manners Section) */}
                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-wider text-cyan-700 mb-4">📸 Rules & Policies</h3>
                                <div className="flex items-center space-x-3 p-4 border-2 border-slate-100 rounded-xl bg-slate-50">
                                    <input name="photography_allowed" type="checkbox" defaultChecked className="w-6 h-6 accent-cyan-600" />
                                    <div>
                                        <label className="font-bold text-slate-700 block">Photography Allowed?</label>
                                        <span className="text-xs text-slate-500">Uncheck if cameras/tripods are strictly prohibited.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 7: SEASONAL & VISUAL */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-pink-500 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">7</span>
                                Seasonal & Visual
                            </h2>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Sakura */}
                                <div className="p-4 border-2 border-pink-50 rounded-2xl bg-pink-50/30">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <input name="is_sakura_spot" type="checkbox" className="w-6 h-6 accent-pink-500" />
                                        <label className="font-bold text-pink-700">Sakura (Cherry Blossom) Spot</label>
                                    </div>
                                    <input name="peak_bloom_window" type="text" placeholder="e.g. Late March to Early April" className="w-full border-slate-200 border-2 p-2 rounded-lg text-sm" />
                                </div>
                                {/* Autumn */}
                                <div className="p-4 border-2 border-orange-50 rounded-2xl bg-orange-50/30">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <input name="is_koyo_spot" type="checkbox" className="w-6 h-6 accent-orange-500" />
                                        <label className="font-bold text-orange-700">Autumn Foliage (Koyo) Spot</label>
                                    </div>
                                    <input name="peak_foliage_window" type="text" placeholder="e.g. Mid to Late November" className="w-full border-slate-200 border-2 p-2 rounded-lg text-sm" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Winter */}
                                <div className="p-4 border-2 border-blue-50 rounded-2xl bg-blue-50/30">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <input name="is_snow_spot" type="checkbox" className="w-6 h-6 accent-blue-400" />
                                        <label className="font-bold text-blue-700">Winter Snow Spot</label>
                                    </div>
                                    <input name="peak_snow_window" type="text" placeholder="e.g. January to February" className="w-full border-slate-200 border-2 p-2 rounded-lg text-sm" />
                                </div>
                                {/* Light Up */}
                                <div className="flex items-center space-x-3 p-4 border-2 border-slate-100 rounded-xl bg-slate-900 text-white">
                                    <input name="night_light_up" type="checkbox" className="w-6 h-6 accent-yellow-400" />
                                    <label className="font-bold">Night Illumination Available?</label>
                                </div>
                            </div>

                            {/* Special Events */}
                            <div className="pt-6 border-t border-slate-100">
                                <div className="flex items-center space-x-3 mb-4">
                                    <input name="has_event" type="checkbox" className="w-6 h-6 accent-pink-500" />
                                    <label className="font-bold text-slate-700">Has Special Seasonal Events?</label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input name="event_name" type="text" placeholder="Event Name (e.g. Mitama Matsuri)" className="md:col-span-1 border-slate-200 border-2 p-3 rounded-xl" />
                                    <input name="event_start" type="text" placeholder="Start (e.g. Nov)" className="border-slate-200 border-2 p-3 rounded-xl" />
                                    <input name="event_end" type="text" placeholder="End (e.g. Feb)" className="border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 8: SOCIALS & CONTACTS */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-sky-600 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-sky-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">8</span>
                                Socials & Contacts
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Official Website (EN)</label>
                                    <input name="official_website_en" type="url" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Official Website (JP)</label>
                                    <input name="official_website_jp" type="url" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Instagram Handle</label>
                                    <input name="instagram" type="text" placeholder="@..." className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">LINE Official Account</label>
                                    <input name="line_account" type="text" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                                    <input name="phone_number" type="tel" placeholder="+81-XX-XXXX-XXXX" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Support Languages</label>
                                    <input name="phone_support_languages" type="text" placeholder="Japanese, English" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Inquiry</label>
                                    <input name="email_inquiry" type="email" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Emergency Contact</label>
                                    <input name="emergency_contact" type="text" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 9: CROWD & VIBE */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-10">
                        <div className="bg-indigo-700 p-6 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="mr-3 bg-white text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">9</span>
                                Crowd & Vibe
                            </h2>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Avg Daily Visitors</label>
                                    <input name="average_daily_visitors" type="number" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Peak Hours (Comma separated)</label>
                                    <input name="peak_hours" type="text" placeholder="11:00, 15:00" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Best Time to Avoid Crowds</label>
                                    <input name="avoid_crowds" type="text" placeholder="Before 9:00 AM" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Primary Vibe</label>
                                    <select name="vibe_primary" className="w-full border-slate-200 border-2 p-3 rounded-xl bg-white">
                                        <option value="Spiritual">Spiritual</option>
                                        <option value="Energetic">Energetic</option>
                                        <option value="Nostalgic">Nostalgic</option>
                                        <option value="Futuristic">Futuristic</option>
                                        <option value="Relaxing">Relaxing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Target Audience (Comma separated)</label>
                                    <input name="target_audience" type="text" placeholder="Families, Solo Travelers, History Buffs" className="w-full border-slate-200 border-2 p-3 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STICKY SUBMIT BAR */}
                    <div className="sticky bottom-4">
                        <button type="submit" className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-2xl hover:bg-blue-700 transform active:scale-95 transition-all">
                            Save Sightseeing Spot to MongoDB
                        </button>
                    </div>



                </form>
            </div>
        </div>
    );
}