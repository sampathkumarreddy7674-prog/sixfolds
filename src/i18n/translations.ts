import { LanguageCode } from '../types';

export interface TranslationDictionary {
  // App brand
  appName: string;
  appTagline: string;
  
  // Language selection
  selectLanguageTitle: string;
  selectLanguageSubtitle: string;
  continueBtn: string;

  // Role selection
  roleQuestion: string;
  roleSubtitle: string;
  farmerRoleTitle: string;
  farmerRoleDesc: string;
  buyerRoleTitle: string;
  buyerRoleDesc: string;
  
  // Navigation
  navHome: string;
  navMyFarm: string;
  navAIAssistant: string;
  navAlerts: string;
  navCommunity: string;
  navProfile: string;
  navFindCrops: string;
  navMyEnquiries: string;
  
  // Header & Land Selector
  selectedLandLabel: string;
  allLands: string;
  addNewLand: string;
  noLandsYet: string;
  switchLand: string;
  
  // Farmer Registration
  farmerRegTitle: string;
  farmerRegSubtitle: string;
  fullNameLabel: string;
  phoneLabel: string;
  districtLabel: string;
  stateLabel: string;
  locationLabel: string;
  useCurrentLocation: string;
  locationDetecting: string;
  manualLocationNotice: string;
  farmingExpLabel: string;
  farmingExp1: string;
  farmingExp2: string;
  farmingExp3: string;
  farmingExp4: string;
  createFarmerAccount: string;
  
  // Buyer Registration
  buyerRegTitle: string;
  buyerRegSubtitle: string;
  businessNameLabel: string;
  buyerContactLabel: string;
  buyerTypeLabel: string;
  cropsInterestedLabel: string;
  createBuyerAccount: string;

  // Lands
  myLandsTitle: string;
  myLandsSubtitle: string;
  landNameLabel: string;
  areaLabel: string;
  areaUnitLabel: string;
  irrigationTypeLabel: string;
  currentCropLabel: string;
  cropVarietyLabel: string;
  plantingDateLabel: string;
  cropStageLabel: string;
  viewLandBtn: string;
  manageLandBtn: string;
  landDetailsTitle: string;
  saveLandBtn: string;
  deleteLandBtn: string;
  landCreatedSuccess: string;

  // Soil Health
  soilHealthTitle: string;
  soilHealthSubtitle: string;
  overallSoilStatus: string;
  goodStatus: string;
  moderateStatus: string;
  needsAttentionStatus: string;
  testDateLabel: string;
  laboratoryLabel: string;
  manualEntryTab: string;
  imageUploadTab: string;
  pdfUploadTab: string;
  saveSoilCardBtn: string;
  soilGuidanceTitle: string;
  dropFileOrBrowse: string;
  fileSelected: string;
  extractingData: string;

  // Soil Nutrients
  phLabel: string;
  nitrogenLabel: string;
  phosphorusLabel: string;
  potassiumLabel: string;
  organicCarbonLabel: string;
  sulphurLabel: string;
  zincLabel: string;
  ironLabel: string;
  manganeseLabel: string;
  copperLabel: string;
  boronLabel: string;
  ecLabel: string;

  // Dashboard
  welcomeFarmer: string;
  weatherTitle: string;
  currentCropTitle: string;
  cropStageTitle: string;
  irrigationStatusTitle: string;
  todayTasksTitle: string;
  alertsTitle: string;
  conflictResolverHeroTitle: string;
  conflictResolverHeroDesc: string;
  openResolverBtn: string;
  askAIBtn: string;

  // Recommendation Conflict Resolver
  resolverTitle: string;
  resolverSubtitle: string;
  masterRecommendationLabel: string;
  conflictDetectedBadge: string;
  noConflictBadge: string;
  whyThisDecisionTitle: string;
  confidenceScoreLabel: string;
  estimatedImpactLabel: string;
  systemInputsTitle: string;
  soilSystemLabel: string;
  weatherSystemLabel: string;
  irrigationSystemLabel: string;
  cropPlanningSystemLabel: string;
  cropHealthSystemLabel: string;
  runConflictCheckBtn: string;
  analyzingSystems: string;
  actionChecklistTitle: string;
  safetyPrecautionsTitle: string;
  resolveNewScenarioBtn: string;

  // My Farm submodules
  subTabLands: string;
  subTabSoil: string;
  subTabPlanning: string;
  subTabCalendar: string;
  subTabIrrigation: string;
  subTabCropHealth: string;
  subTabResolver: string;
  subTabYield: string;
  subTabMarket: string;
  subTabStorage: string;
  subTabProfit: string;
  subTabLogistics: string;
  subTabSchemes: string;
  subTabSustainability: string;

  // Common
  speakToAI: string;
  typeMessage: string;
  uploadPhoto: string;
  todaysWorkTitle: string;
  ourSuggestionTitle: string;
  whyTitle: string;
  moreDetailsBtn: string;
  rainAlertTitle: string;
  waterAlertTitle: string;
  cropAlertTitle: string;
  marketAlertTitle: string;
  farmAlertTitle: string;
  farmerCommunityTitle: string;
  askQuestionBtn: string;
  seeAnswersBtn: string;
  whatShouldIDoTodayQuestion: string;
  loading: string;
  saving: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  search: string;
  filter: string;
  close: string;
  refresh: string;
  urgent: string;
  recommended: string;
  completed: string;
  pending: string;
  errorRequired: string;
  successSaved: string;
  logout: string;
  settings: string;
  notifications: string;
  privacy: string;
  helpAndSupport: string;
  aboutAgriResolve: string;
  kisanHelpline: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: "AgriResolve",
    appTagline: "AI Recommendation Conflict Resolver for Smart Farming",
    
    selectLanguageTitle: "Choose Your Language",
    selectLanguageSubtitle: "Select the language you want to use across the entire app",
    continueBtn: "Continue",

    roleQuestion: "Are you a Farmer or a Buyer?",
    roleSubtitle: "Select your profile type to get customized agricultural services",
    farmerRoleTitle: "I am a Farmer",
    farmerRoleDesc: "Manage multiple lands, resolve conflicting advice, track soil health, weather, irrigation & sell produce.",
    buyerRoleTitle: "I am a Buyer / Trader",
    buyerRoleDesc: "Source direct fresh farm produce, discover crops by harvest dates, contact verified farmers.",

    navHome: "Home",
    navMyFarm: "Farm",
    navAIAssistant: "AI",
    navAlerts: "Alerts",
    navCommunity: "Community",
    navProfile: "Profile",
    navFindCrops: "Find Crops",
    navMyEnquiries: "My Enquiries",

    selectedLandLabel: "Current Land",
    allLands: "All Lands",
    addNewLand: "+ Add New Land",
    noLandsYet: "No lands added yet. Add your first land to begin.",
    switchLand: "Switch Land",

    farmerRegTitle: "Farmer Registration",
    farmerRegSubtitle: "Create your farm profile to receive smart localized advisories",
    fullNameLabel: "Full Name",
    phoneLabel: "Phone Number",
    districtLabel: "District",
    stateLabel: "State",
    locationLabel: "Village / Town / Location",
    useCurrentLocation: "Use GPS Location",
    locationDetecting: "Detecting GPS location...",
    manualLocationNotice: "Location permission denied or unavailable. Please type manually.",
    farmingExpLabel: "Farming Experience",
    farmingExp1: "1 to 3 Years (Beginner)",
    farmingExp2: "4 to 10 Years (Experienced)",
    farmingExp3: "10 to 20 Years (Expert)",
    farmingExp4: "20+ Years (Master Farmer)",
    createFarmerAccount: "Start Farming with AgriResolve",

    buyerRegTitle: "Buyer Registration",
    buyerRegSubtitle: "Connect directly with farmers for high-quality produce sourcing",
    businessNameLabel: "Business / Trade Name",
    buyerContactLabel: "Phone or Business Email",
    buyerTypeLabel: "Buyer Category",
    cropsInterestedLabel: "Crops Interested In",
    createBuyerAccount: "Register as Buyer",

    myLandsTitle: "My Lands & Farms",
    myLandsSubtitle: "Each land has separate soil, weather, irrigation, and AI data.",
    landNameLabel: "Land / Plot Name",
    areaLabel: "Total Area",
    areaUnitLabel: "Area Unit",
    irrigationTypeLabel: "Irrigation Type",
    currentCropLabel: "Current Crop",
    cropVarietyLabel: "Crop Variety",
    plantingDateLabel: "Planting / Sowing Date",
    cropStageLabel: "Current Crop Stage",
    viewLandBtn: "View Land Data",
    manageLandBtn: "Manage Land",
    landDetailsTitle: "Land Profile & Settings",
    saveLandBtn: "Save Land",
    deleteLandBtn: "Delete Land",
    landCreatedSuccess: "Land registered successfully!",

    soilHealthTitle: "Soil Health Card",
    soilHealthSubtitle: "Independent soil nutrients test card for",
    overallSoilStatus: "Overall Soil Quality",
    goodStatus: "GOOD",
    moderateStatus: "MODERATE",
    needsAttentionStatus: "NEEDS ATTENTION",
    testDateLabel: "Soil Test Date",
    laboratoryLabel: "Testing Laboratory / Krishi Kendra",
    manualEntryTab: "Manual Entry",
    imageUploadTab: "Upload Photo",
    pdfUploadTab: "Upload PDF",
    saveSoilCardBtn: "Update Soil Card",
    soilGuidanceTitle: "Soil Improvement Guidance",
    dropFileOrBrowse: "Tap or drop your official Soil Card here",
    fileSelected: "File uploaded successfully",
    extractingData: "Analyzing soil card values...",

    phLabel: "pH Level",
    nitrogenLabel: "Nitrogen (N)",
    phosphorusLabel: "Phosphorus (P)",
    potassiumLabel: "Potassium (K)",
    organicCarbonLabel: "Organic Carbon (OC)",
    sulphurLabel: "Sulphur (S)",
    zincLabel: "Zinc (Zn)",
    ironLabel: "Iron (Fe)",
    manganeseLabel: "Manganese (Mn)",
    copperLabel: "Copper (Cu)",
    boronLabel: "Boron (B)",
    ecLabel: "Electrical Conductivity (EC)",

    welcomeFarmer: "Welcome back,",
    weatherTitle: "Weather Forecast",
    currentCropTitle: "Crop Status",
    cropStageTitle: "Stage Progress",
    irrigationStatusTitle: "Irrigation Advisory",
    todayTasksTitle: "Today's Farm Tasks",
    alertsTitle: "Important Farm Alerts",
    conflictResolverHeroTitle: "Agricultural Conflict Resolver",
    conflictResolverHeroDesc: "We analyzed 5 separate advisories for your land and resolved opposing recommendations into one clear plan.",
    openResolverBtn: "View Recommendation Resolution",
    askAIBtn: "Ask AgriResolve AI",

    resolverTitle: "Recommendation Conflict Resolver",
    resolverSubtitle: "Synthesizing Soil, Weather, Irrigation, Planning & Crop Health systems into one unified action.",
    masterRecommendationLabel: "Unified Actionable Recommendation",
    conflictDetectedBadge: "Conflicts Detected & Resolved",
    noConflictBadge: "All Systems In Agreement",
    whyThisDecisionTitle: "Why was this decision prioritized?",
    confidenceScoreLabel: "AI Confidence Score",
    estimatedImpactLabel: "Estimated Benefit / Savings",
    systemInputsTitle: "Individual System Advisories Evaluated",
    soilSystemLabel: "Soil System",
    weatherSystemLabel: "Weather System",
    irrigationSystemLabel: "Irrigation System",
    cropPlanningSystemLabel: "Crop Planning",
    cropHealthSystemLabel: "Crop Health",
    runConflictCheckBtn: "Re-Evaluate Conflicts",
    analyzingSystems: "Cross-analyzing all 5 advisory streams...",
    actionChecklistTitle: "Action Checklist for Farmer",
    safetyPrecautionsTitle: "Safety & Nutrient Loss Warnings",
    resolveNewScenarioBtn: "Simulate Custom Advisory Conflict",

    subTabLands: "My Lands",
    subTabSoil: "Soil",
    subTabPlanning: "Crop",
    subTabCalendar: "Calendar",
    subTabIrrigation: "💧 Water Advice",
    subTabCropHealth: "📷 Check Crop",
    subTabResolver: "⚠️ Different Advice",
    subTabYield: "Yield Prediction",
    subTabMarket: "💰 Sell Crop",
    subTabStorage: "Storage Advisor",
    subTabProfit: "Profit Calculator",
    subTabLogistics: "Logistics",
    subTabSchemes: "Govt Schemes",
    subTabSustainability: "Sustainability",

    speakToAI: "🎤 SPEAK TO AI",
    typeMessage: "⌨️ Type",
    uploadPhoto: "📷 Upload Photo",
    todaysWorkTitle: "📋 TODAY'S WORK",
    ourSuggestionTitle: "🤖 OUR SUGGESTION",
    whyTitle: "WHY?",
    moreDetailsBtn: "More Details",
    rainAlertTitle: "🌧️ RAIN ALERT",
    waterAlertTitle: "💧 WATER ALERT",
    cropAlertTitle: "🌱 CROP ALERT",
    marketAlertTitle: "💰 MARKET ALERT",
    farmAlertTitle: "⚠️ FARM ALERT",
    farmerCommunityTitle: "👨‍🌾 FARMER COMMUNITY",
    askQuestionBtn: "❓ Ask Question",
    seeAnswersBtn: "💬 See Answers",
    whatShouldIDoTodayQuestion: "What should I do today?",

    loading: "Loading...",
    saving: "Saving...",
    cancel: "Cancel",
    save: "Save Changes",
    edit: "Edit",
    delete: "Delete",
    search: "Search...",
    filter: "Filter",
    close: "Close",
    refresh: "Refresh",
    urgent: "URGENT",
    recommended: "RECOMMENDED",
    completed: "Done",
    pending: "Pending",
    errorRequired: "Please fill out this field",
    successSaved: "Saved successfully!",
    logout: "Log Out",
    settings: "Settings",
    notifications: "Notifications",
    privacy: "Privacy & Data Protection",
    helpAndSupport: "Help & Kisan Helpline",
    aboutAgriResolve: "About AgriResolve",
    kisanHelpline: "Kisan Call Center: 1800-180-1551 (Toll Free)"
  },

  ta: {
    appName: "அக்ரி-ரிசால்வ்",
    appTagline: "ஸ்மார்ட் விவசாயத்திற்கான AI முரண்பாடு தீர்வு தளம்",
    
    selectLanguageTitle: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    selectLanguageSubtitle: "முழு செயலிலும் பயன்படுத்த விரும்பும் மொழியைத் தேர்ந்தெடுக்கவும்",
    continueBtn: "தொடரவும்",

    roleQuestion: "நீங்கள் விவசாயியா அல்லது வாங்குபவரா?",
    roleSubtitle: "தனிப்பயனாக்கப்பட்ட சேவைகளைப் பெற உங்கள் சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்",
    farmerRoleTitle: "நான் ஒரு விவசாயி",
    farmerRoleDesc: "நிலங்களை நிர்வகிக்கவும், முரண்பட்ட விவசாய ஆலோசனைகளைத் தீர்க்கவும், பயிர், மண், வானிலை கண்காணிக்கவும்.",
    buyerRoleTitle: "நான் ஒரு வாங்குபவர் / வியாபாரி",
    buyerRoleDesc: "விவசாயிகளிடமிருந்து நேரடியாக பயிர்களை வாங்கவும், அறுவடை தேதிகளை அறியவும்.",

    navHome: "முகப்பு",
    navMyFarm: "பண்ணை",
    navAIAssistant: "AI",
    navAlerts: "எச்சரிக்கைகள்",
    navCommunity: "சமூகம்",
    navProfile: "சுயவிவரம்",
    navFindCrops: "பயிர்களைத் தேடு",
    navMyEnquiries: "என் விசாரணைகள்",

    selectedLandLabel: "தேர்ந்தெடுக்கப்பட்ட நிலம்",
    allLands: "அனைத்து நிலங்கள்",
    addNewLand: "+ புதிய நிலம் சேர்க்கவும்",
    noLandsYet: "இன்னும் நிலம் சேர்க்கப்படவில்லை. உங்கள் முதல் நிலத்தைச் சேர்க்கவும்.",
    switchLand: "நிலத்தை மாற்றவும்",

    farmerRegTitle: "விவசாயி பதிவு",
    farmerRegSubtitle: "துல்லியமான உள்ளூர் ஆலோசனைகளைப் பெற பதிவு செய்யவும்",
    fullNameLabel: "முழு பெயர்",
    phoneLabel: "தொலைபேசி எண்",
    districtLabel: "மாவட்டம்",
    stateLabel: "மாநிலம்",
    locationLabel: "கிராமம் / ஊர் / இருப்பிடம்",
    useCurrentLocation: "GPS இருப்பிடத்தைப் பயன்படுத்தவும்",
    locationDetecting: "GPS கண்டறியப்படுகிறது...",
    manualLocationNotice: "இருப்பிட அனுமதி கிடைக்கவில்லை. தயவுசெய்து தட்டச்சு செய்யவும்.",
    farmingExpLabel: "விவசாய அனுபவம்",
    farmingExp1: "1 முதல் 3 ஆண்டுகள் (ஆரம்பம்)",
    farmingExp2: "4 முதல் 10 ஆண்டுகள் (அனுபவம்)",
    farmingExp3: "10 முதல் 20 ஆண்டுகள் (வல்லுநர்)",
    farmingExp4: "20+ ஆண்டுகள் (முதுநிலை விவசாயி)",
    createFarmerAccount: "விவசாயத்தை தொடங்கவும்",

    buyerRegTitle: "வாங்குபவர் பதிவு",
    buyerRegSubtitle: "விவசாயிகளிடமிருந்து நேரடியாக தரமான விளைபொருட்களைப் பெறவும்",
    businessNameLabel: "வணிகப் பெயர்",
    buyerContactLabel: "தொலைபேசி அல்லது மின்னஞ்சல்",
    buyerTypeLabel: "வாங்குபவர் வகை",
    cropsInterestedLabel: "ஆர்வமுள்ள பயிர்கள்",
    createBuyerAccount: "வாங்குபவராக பதிவு செய்யவும்",

    myLandsTitle: "என் நிலங்கள்",
    myLandsSubtitle: "ஒவ்வொரு நிலத்திற்கும் தனித்தனி மண், வானிலை, பாசனம் மற்றும் AI தரவு உள்ளது.",
    landNameLabel: "நிலத்தின் பெயர்",
    areaLabel: "மொத்த பரப்பளவு",
    areaUnitLabel: "அலகு",
    irrigationTypeLabel: "பாசன முறை",
    currentCropLabel: "தற்போதைய பயிர்",
    cropVarietyLabel: "பயிர் ரகம்",
    plantingDateLabel: "நடவு செய்த தேதி",
    cropStageLabel: "தற்போதைய பயிர் நிலை",
    viewLandBtn: "நில விவரம் பார்க்க",
    manageLandBtn: "நிலத்தை நிர்வகி",
    landDetailsTitle: "நிலத்தின் சுயவிவரம்",
    saveLandBtn: "நிலத்தைச் சேமி",
    deleteLandBtn: "நிலத்தை நீக்கு",
    landCreatedSuccess: "நிலம் வெற்றிகரமாகச் சேர்க்கப்பட்டது!",

    soilHealthTitle: "மண் வள அட்டை",
    soilHealthSubtitle: "மண் ஊட்டச்சத்து பரிசோதனை அட்டை:",
    overallSoilStatus: "ஒட்டுமொத்த மண் தரம்",
    goodStatus: "நன்று",
    moderateStatus: "மிதமானது",
    needsAttentionStatus: "கவனம் தேவை",
    testDateLabel: "பரிசோதனை தேதி",
    laboratoryLabel: "ஆய்வகம் / வேளாண் மையம்",
    manualEntryTab: "நேரடி பதிவு",
    imageUploadTab: "புகைப்படம் பதிவேற்றுக",
    pdfUploadTab: "PDF பதிவேற்றுக",
    saveSoilCardBtn: "மண் அட்டையைப் புதுப்பிக்கவும்",
    soilGuidanceTitle: "மண் வள மேம்பாட்டு வழிகாட்டுதல்",
    dropFileOrBrowse: "மண் அட்டையை இங்கே பதிவேற்றவும்",
    fileSelected: "கோப்பு வெற்றிகரமாகப் பதிவேற்றப்பட்டது",
    extractingData: "மண் அட்டை தகவல்கள் பகுப்பாய்வு செய்யப்படுகின்றன...",

    phLabel: "pH கார அமில நிலை",
    nitrogenLabel: "நைட்ரஜன் (தழைச்சத்து)",
    phosphorusLabel: "பாஸ்பரஸ் (மணிச்சத்து)",
    potassiumLabel: "பொட்டாசியம் (சாம்பல் சத்து)",
    organicCarbonLabel: "கரிம கார்பன்",
    sulphurLabel: "கந்தகம் (S)",
    zincLabel: "துத்தநாகம் (Zn)",
    ironLabel: "இரும்பு (Fe)",
    manganeseLabel: "மாங்கனீசு (Mn)",
    copperLabel: "தாமிரம் (Cu)",
    boronLabel: "போரான் (B)",
    ecLabel: "மின் கடத்துத்திறன் (EC)",

    welcomeFarmer: "வணக்கம்,",
    weatherTitle: "வானிலை முன்னறிவிப்பு",
    currentCropTitle: "பயிர் நிலை",
    cropStageTitle: "வளர்ச்சி நிலை",
    irrigationStatusTitle: "பாசன ஆலோசனை",
    todayTasksTitle: "இன்றைய பண்ணை பணிகள்",
    alertsTitle: "முக்கிய எச்சரிக்கைகள்",
    conflictResolverHeroTitle: "பரிந்துரை முரண்பாடு தீர்க்கும் கருவி",
    conflictResolverHeroDesc: "மண், வானிலை, பாசனம், பயிர் சுகாதாரம் ஆகியவற்றின் எதிரெதிர் ஆலோசனைகளை ஆய்வு செய்து ஒரு தெளிவான முடிவை வழங்குகிறது.",
    openResolverBtn: "முரண்பாடு முடிவைக் காண்க",
    askAIBtn: "AI உதவியாளரிடம் கேட்கவும்",

    resolverTitle: "பரிந்துரை முரண்பாடு தீர்வு அமைப்பு",
    resolverSubtitle: "மண், வானிலை, பாசனம், பயிர் திட்டமிடல் மற்றும் பயிர் நல அமைப்புகளின் ஒருமித்த நடவடிக்கை.",
    masterRecommendationLabel: "ஒருங்கிணைந்த நடைமுறை பரிந்துரை",
    conflictDetectedBadge: "முரண்பாடுகள் தீர்க்கப்பட்டன",
    noConflictBadge: "அனைத்து அமைப்புகளும் ஒத்திசைவில் உள்ளன",
    whyThisDecisionTitle: "இந்த முடிவுக்கு ஏன் முன்னுரிமை அளிக்கப்பட்டது?",
    confidenceScoreLabel: "AI துல்லிய அளவு",
    estimatedImpactLabel: "எதிர்பார்க்கப்படும் சேமிப்பு / நன்மை",
    systemInputsTitle: "ஆய்வு செய்யப்பட்ட அமைப்புகளின் ஆலோசனைகள்",
    soilSystemLabel: "மண் அமைப்பு",
    weatherSystemLabel: "வானிலை அமைப்பு",
    irrigationSystemLabel: "பாசன அமைப்பு",
    cropPlanningSystemLabel: "பயிர் திட்டமிடல்",
    cropHealthSystemLabel: "பயிர் நலம்",
    runConflictCheckBtn: "மீண்டும் ஆய்வு செய்க",
    analyzingSystems: "அனைத்து 5 அமைப்புகளையும் ஒப்பிடுகிறது...",
    actionChecklistTitle: "விவசாயிக்கான உடனடி பணிகள்",
    safetyPrecautionsTitle: "பாதுகாப்பு & உரம் விரய எச்சரிக்கைகள்",
    resolveNewScenarioBtn: "புதிய முரண்பாட்டைச் சோதிக்கவும்",

    subTabLands: "என் நிலங்கள்",
    subTabSoil: "மண்",
    subTabPlanning: "பயிர்",
    subTabCalendar: "காலண்டர்",
    subTabIrrigation: "💧 நீர் ஆலோசனை",
    subTabCropHealth: "📷 பயிர் சோதனை",
    subTabResolver: "⚠️ மாற்று ஆலோசனை",
    subTabYield: "மகசூல் கணிப்பு",
    subTabMarket: "💰 பயிர் விற்பனை",
    subTabStorage: "சேமிப்பு வழிகாட்டி",
    subTabProfit: "லாபக் கணக்கீடு",
    subTabLogistics: "போக்குவரத்து",
    subTabSchemes: "அரசுத் திட்டங்கள்",
    subTabSustainability: "இயற்கை வேளாண்மை",

    speakToAI: "🎤 AI-யிடம் பேசவும்",
    typeMessage: "⌨️ தட்டச்சு",
    uploadPhoto: "📷 படம் பதிவேற்றுக",
    todaysWorkTitle: "📋 இன்றைய பணிகள்",
    ourSuggestionTitle: "🤖 எங்கள் பரிந்துரை",
    whyTitle: "ஏன்?",
    moreDetailsBtn: "கூடுதல் விவரங்கள்",
    rainAlertTitle: "🌧️ மழை எச்சரிக்கை",
    waterAlertTitle: "💧 நீர் எச்சரிக்கை",
    cropAlertTitle: "🌱 பயிர் எச்சரிக்கை",
    marketAlertTitle: "💰 சந்தை எச்சரிக்கை",
    farmAlertTitle: "⚠️ பண்ணை எச்சரிக்கை",
    farmerCommunityTitle: "👨‍🌾 விவசாயி சமூகம்",
    askQuestionBtn: "❓ கேள்வி கேட்க",
    seeAnswersBtn: "💬 பதில்களைக் காண்க",
    whatShouldIDoTodayQuestion: "இன்று நான் என்ன செய்ய வேண்டும்?",

    loading: "ஏற்றப்படுகிறது...",
    saving: "சேமிக்கப்படுகிறது...",
    cancel: "ரத்து செய்",
    save: "சேமிக்கவும்",
    edit: "திருத்து",
    delete: "நீக்கு",
    search: "தேடுக...",
    filter: "வடிகட்டு",
    close: "மூடு",
    refresh: "புதுப்பி",
    urgent: "அவசரம்",
    recommended: "பரிந்துரைக்கப்படுகிறது",
    completed: "முடிந்தது",
    pending: "நிலுவையில்",
    errorRequired: "தயவுசெய்து இந்த புலத்தை நிரப்பவும்",
    successSaved: "வெற்றிகரமாகச் சேமிக்கப்பட்டது!",
    logout: "வெளியேறு",
    settings: "அமைப்புகள்",
    notifications: "அறிவிப்புகள்",
    privacy: "தனியுரிமை",
    helpAndSupport: "உதவி & விவசாய உதவி எண்",
    aboutAgriResolve: "அக்ரி-ரிசால்வ் பற்றி",
    kisanHelpline: "கிசான் அழைப்பு மையம்: 1800-180-1551 (கட்டணமில்லா சேவை)"
  },

  te: {
    appName: "అగ్రి-రిసాల్వ్",
    appTagline: "స్మార్ట్ వ్యవసాయం కోసం AI సిఫార్సుల వివాద పరిష్కర్త",
    
    selectLanguageTitle: "మీ భాషను ఎంచుకోండి",
    selectLanguageSubtitle: "యాప్ అంతటా ఉపయోగించడానికి మీకు నచ్చిన భాషను ఎంచుకోండి",
    continueBtn: "కొనసాగించండి",

    roleQuestion: "మీరు రైతు లేదా కొనుగోలుదారునా?",
    roleSubtitle: "వ్యవసాయ సేవలను పొందడానికి మీ పాత్రను ఎంచుకోండి",
    farmerRoleTitle: "నేను రైతును",
    farmerRoleDesc: "బహుళ భూములను నిర్వహించండి, విరుద్ధమైన సలహాలను పరిష్కరించండి, నేల, వాతావరణం పర్యవేక్షించండి.",
    buyerRoleTitle: "నేను కొనుగోలుదారు / వ్యాపారిని",
    buyerRoleDesc: "రైతుల నుండి నేరుగా పంటలను కొనుగోలు చేయండి, కోత తేదీలను పరిశీలించండి.",

    navHome: "హోమ్",
    navMyFarm: "వ్యవసాయం",
    navAIAssistant: "AI",
    navAlerts: "హెచ్చరికలు",
    navCommunity: "కమ్యూనిటీ",
    navProfile: "ప్రొఫైల్",
    navFindCrops: "పంటల శోధన",
    navMyEnquiries: "నా విచారణలు",

    selectedLandLabel: "ప్రస్తుత భూమి",
    allLands: "అన్ని భూములు",
    addNewLand: "+ కొత్త భూమిని జోడించండి",
    noLandsYet: "ఇంకా భూములు జోడించబడలేదు. మొదటి భూమిని చేర్చండి.",
    switchLand: "భూమిని మార్చండి",

    farmerRegTitle: "రైతు నమోదు",
    farmerRegSubtitle: "స్మార్ట్ స్థానిక సలహాలను పొందడానికి మీ ప్రొఫైల్ నమోదు చేయండి",
    fullNameLabel: "పూర్తి పేరు",
    phoneLabel: "ఫోన్ నంబర్",
    districtLabel: "జిల్లా",
    stateLabel: "రాష్ట్రం",
    locationLabel: "గ్రామం / పట్టణం / లొకేషన్",
    useCurrentLocation: "GPS లొకేషన్ ఉపయోగించండి",
    locationDetecting: "GPS గుర్తించబడుతోంది...",
    manualLocationNotice: "లొకేషన్ అనుమతి లభించలేదు. దయచేసి టైప్ చేయండి.",
    farmingExpLabel: "వ్యవసాయ అనుభవం",
    farmingExp1: "1 నుండి 3 సంవత్సరాలు",
    farmingExp2: "4 నుండి 10 సంవత్సరాలు",
    farmingExp3: "10 నుండి 20 సంవత్సరాలు",
    farmingExp4: "20+ సంవత్సరాలు",
    createFarmerAccount: "వ్యవసాయాన్ని ప్రారంభించండి",

    buyerRegTitle: "కొనుగోలుదారు నమోదు",
    buyerRegSubtitle: "రైతుల నుండి నేరుగా నాణ్యమైన పంటలను కొనుగోలు చేయండి",
    businessNameLabel: "వ్యాపార పేరు",
    buyerContactLabel: "ఫోన్ లేదా వ్యాపార ఈమెయిల్",
    buyerTypeLabel: "కొనుగోలుదారు వర్గం",
    cropsInterestedLabel: "ఆసక్తి ఉన్న పంటలు",
    createBuyerAccount: "కొనుగోలుదారుగా నమోదు అవ్వండి",

    myLandsTitle: "నా భూములు & పొలాలు",
    myLandsSubtitle: "ప్రతి భూమికి ప్రత్యేకమైన నేల, వాతావరణం మరియు AI సమాచారం ఉంటుంది.",
    landNameLabel: "భూమి / ప్లాట్ పేరు",
    areaLabel: "మొత్తం విస్తీర్ణం",
    areaUnitLabel: "యూనిట్",
    irrigationTypeLabel: "నీటిపారుదల రకం",
    currentCropLabel: "ప్రస్తుత పంట",
    cropVarietyLabel: "పంట రకం",
    plantingDateLabel: "విత్తిన / నాటిన తేదీ",
    cropStageLabel: "పంట ప్రస్తుత దశ",
    viewLandBtn: "భూమి వివరాలు చూడండి",
    manageLandBtn: "భూమి నిర్వహణ",
    landDetailsTitle: "భూమి ప్రొఫైల్",
    saveLandBtn: "భూమిని సేవ్ చేయండి",
    deleteLandBtn: "భూమిని తొలగించండి",
    landCreatedSuccess: "భూమి విజయవంతంగా నమోదు చేయబడింది!",

    soilHealthTitle: "నేల ఆరోగ్య పత్రం (Soil Health Card)",
    soilHealthSubtitle: "నేల పోషకాల పరీక్ష నివేదిక:",
    overallSoilStatus: "మొత్తం నేల నాణ్యత",
    goodStatus: "మంచిది",
    moderateStatus: "మధ్యస్థం",
    needsAttentionStatus: "శ్రద్ధ అవసరం",
    testDateLabel: "పరీక్ష తేదీ",
    laboratoryLabel: "ప్రయోగశాల / కృషి విజ్ఞాన కేంద్రం",
    manualEntryTab: "నేరుగా నమోదు",
    imageUploadTab: "ఫోటో అప్‌లోడ్",
    pdfUploadTab: "PDF అప్‌లోడ్",
    saveSoilCardBtn: "నేల పత్రాన్ని నవీకరించండి",
    soilGuidanceTitle: "నేల మెరుగుదల సూచనలు",
    dropFileOrBrowse: "మీ నేల పరీక్ష పత్రాన్ని ఇక్కడ అప్‌లోడ్ చేయండి",
    fileSelected: "ఫైల్ విజయవంతంగా అప్‌లోడ్ అయింది",
    extractingData: "నేల నివేదికను విశ్లేషిస్తోంది...",

    phLabel: "pH విలువ",
    nitrogenLabel: "నైట్రోజన్ (నత్రజని)",
    phosphorusLabel: "ఫాస్ఫరస్ (భాస్వరం)",
    potassiumLabel: "పొటాషియం (పొటాష్)",
    organicCarbonLabel: "సేంద్రీయ కర్బనం (OC)",
    sulphurLabel: "గంధకం (S)",
    zincLabel: "జింక్ (Zn)",
    ironLabel: "ఇనుము (Fe)",
    manganeseLabel: "మాంగనీస్ (Mn)",
    copperLabel: "రాగి (Cu)",
    boronLabel: "బోరాన్ (B)",
    ecLabel: "విద్యుత్ వాహకత (EC)",

    welcomeFarmer: "స్వాగతం,",
    weatherTitle: "వాతావరణ సమాచారం",
    currentCropTitle: "పంట స్థితి",
    cropStageTitle: "పంట దశ",
    irrigationStatusTitle: "నీటిపారుదల సలహా",
    todayTasksTitle: "నేటి వ్యవసాయ పనులు",
    alertsTitle: "ముఖ్య హెచ్చరికలు",
    conflictResolverHeroTitle: "సిఫార్సుల వివాద పరిష్కర్త",
    conflictResolverHeroDesc: "నేల, వాతావరణం, నీరు, తెగుళ్ల వ్యవస్థల నుండి వచ్చిన పరస్పర విరుద్ధ సలహాలను విశ్లేషించి ఒక స్పష్టమైన పరిష్కారం అందిస్తుంది.",
    openResolverBtn: "వివాద పరిష్కారాన్ని చూడండి",
    askAIBtn: "AI ని అడగండి",

    resolverTitle: "వ్యవసాయ సిఫార్సుల వివాద పరిష్కర్త",
    resolverSubtitle: "నేల, వాతావరణం, నీటిపారుదల, ప్రణాళిక, పంట ఆరోగ్యాన్ని సమన్వయం చేస్తుంది.",
    masterRecommendationLabel: "ఖచ్చితమైన సమగ్ర సిఫార్సు",
    conflictDetectedBadge: "విరుద్ధ సలహాలు పరిష్కరించబడ్డాయి",
    noConflictBadge: "అన్ని వ్యవస్థలు ఏకాభిప్రాయంలో ఉన్నాయి",
    whyThisDecisionTitle: "ఈ నిర్ణయానికి ఎందుకు ప్రాధాన్యత ఇవ్వబడింది?",
    confidenceScoreLabel: "AI విశ్వసనీయత స్కోరు",
    estimatedImpactLabel: "అంచనా పొదుపు / ప్రయోజనం",
    systemInputsTitle: "వ్యవస్థల వ్యక్తిగత సలహాలు",
    soilSystemLabel: "నేల వ్యవస్థ",
    weatherSystemLabel: "వాతావరణ వ్యవస్థ",
    irrigationSystemLabel: "నీటిపారుదల వ్యవస్థ",
    cropPlanningSystemLabel: "పంట ప్రణాళిక",
    cropHealthSystemLabel: "పంట ఆరోగ్యం",
    runConflictCheckBtn: "మళ్లీ విశ్లేషించండి",
    analyzingSystems: "అన్ని 5 వ్యవస్థలను సమన్వయం చేస్తోంది...",
    actionChecklistTitle: "రైతు చేయవలసిన పనులు",
    safetyPrecautionsTitle: "భద్రత & ఎరువుల వృథా హెచ్చరికలు",
    resolveNewScenarioBtn: "కొత్త పరిస్థితిని పరిష్కరించండి",

    subTabLands: "నా భూములు",
    subTabSoil: "నేల",
    subTabPlanning: "పంట",
    subTabCalendar: "క్యాలెండర్",
    subTabIrrigation: "💧 నీటి సలహా",
    subTabCropHealth: "📷 పంట తనిఖీ",
    subTabResolver: "⚠️ విభిన్న సలహాలు",
    subTabYield: "దిగుబడి అంచనా",
    subTabMarket: "💰 పంట అమ్మకం",
    subTabStorage: "నిల్వ సలహాదారు",
    subTabProfit: "లాభ గణన",
    subTabLogistics: "రవాణా",
    subTabSchemes: "ప్రభుత్వ పథకాలు",
    subTabSustainability: "సుస్థిర వ్యవసాయం",

    speakToAI: "🎤 AIతో మాట్లాడండి",
    typeMessage: "⌨️ టైప్ చేయండి",
    uploadPhoto: "📷 ఫోటో అప్‌లోడ్",
    todaysWorkTitle: "📋 నేటి పనులు",
    ourSuggestionTitle: "🤖 మా సలహా",
    whyTitle: "ఎందుకు?",
    moreDetailsBtn: "మరిన్ని వివరాలు",
    rainAlertTitle: "🌧️ వర్షం హెచ్చరిక",
    waterAlertTitle: "💧 నీటి హెచ్చరిక",
    cropAlertTitle: "🌱 పంట హెచ్చరిక",
    marketAlertTitle: "💰 మార్కెట్ హెచ్చరిక",
    farmAlertTitle: "⚠️ వ్యవసాయ హెచ్చరిక",
    farmerCommunityTitle: "👨‍🌾 రైతు కమ్యూనిటీ",
    askQuestionBtn: "❓ ప్రశ్న అడగండి",
    seeAnswersBtn: "💬 సమాధానాలు చూడండి",
    whatShouldIDoTodayQuestion: "ఈరోజు నేను ఏమి చేయాలి?",

    loading: "లోడ్ అవుతోంది...",
    saving: "సేవ్ అవుతోంది...",
    cancel: "రద్దు చేయండి",
    save: "సేవ్ చేయండి",
    edit: "సవరించండి",
    delete: "తొలగించండి",
    search: "వెతకండి...",
    filter: "ఫిల్టర్",
    close: "మూసివేయి",
    refresh: "రిఫ్రెష్",
    urgent: "అత్యవసరం",
    recommended: "సిఫార్సు చేయబడింది",
    completed: "పూర్తయింది",
    pending: "పెండింగ్",
    errorRequired: "దయచేసి ఈ ఫీల్డ్ నింపండి",
    successSaved: "విజయవంతంగా సేవ్ చేయబడింది!",
    logout: "లాగ్ అవుట్",
    settings: "సెట్టింగులు",
    notifications: "నోటిఫికేషన్లు",
    privacy: "గోప్యత",
    helpAndSupport: "సహాయం & కిసాన్ హెల్ప్‌లైన్",
    aboutAgriResolve: "అగ్రి-రిసాల్వ్ గురించి",
    kisanHelpline: "కిసాన్ కాల్ సెంటర్: 1800-180-1551 (టోల్ ఫ్రీ)"
  },

  hi: {
    appName: "एग्री-रिज़ॉल्व",
    appTagline: "स्मार्ट खेती हेतु AI कृषि सिफारिश विवाद निवारक",
    
    selectLanguageTitle: "अपनी भाषा चुनें",
    selectLanguageSubtitle: "पूरी ऐप में उपयोग करने के लिए अपनी पसंदीदा भाषा चुनें",
    continueBtn: "आगे बढ़ें",

    roleQuestion: "आप किसान हैं या खरीदार?",
    roleSubtitle: "अनुकूलित कृषि सेवाएं प्राप्त करने के लिए अपनी भूमिका चुनें",
    farmerRoleTitle: "मैं एक किसान हूँ",
    farmerRoleDesc: "जमीनों का प्रबंधन करें, परस्पर विरोधी सलाहों का समाधान पाएं, मिट्टी, मौसम और सिंचाई ट्रैक करें।",
    buyerRoleTitle: "मैं खरीदार / व्यापारी हूँ",
    buyerRoleDesc: "किसानों से सीधे फसल खरीदें, कटाई की तिथियां देखें और सत्यापित किसानों से संपर्क करें।",

    navHome: "होम",
    navMyFarm: "खेत",
    navAIAssistant: "AI",
    navAlerts: "अलर्ट",
    navCommunity: "समुदाय",
    navProfile: "प्रोफ़ाइल",
    navFindCrops: "फसल खोजें",
    navMyEnquiries: "मेरी पूछताछ",

    selectedLandLabel: "वर्तमान खेत / भूमि",
    allLands: "सभी खेत",
    addNewLand: "+ नया खेत जोड़ें",
    noLandsYet: "अभी तक कोई खेत नहीं जोड़ा गया। शुरुआत करने के लिए पहला खेत जोड़ें।",
    switchLand: "खेत बदलें",

    farmerRegTitle: "किसान पंजीकरण",
    farmerRegSubtitle: "सटीक स्थानीय कृषि सलाह पाने के लिए अपनी प्रोफ़ाइल बनाएं",
    fullNameLabel: "पूरा नाम",
    phoneLabel: "फ़ोन नंबर",
    districtLabel: "जिला",
    stateLabel: "राज्य",
    locationLabel: "गांव / शहर / स्थान",
    useCurrentLocation: "GPS लोकेशन का उपयोग करें",
    locationDetecting: "GPS लोकेशन खोजी जा रही है...",
    manualLocationNotice: "लोकेशन अनुमति नहीं मिली। कृपया हाथ से दर्ज करें।",
    farmingExpLabel: "खेती का अनुभव",
    farmingExp1: "1 से 3 वर्ष (शुरुआती)",
    farmingExp2: "4 से 10 वर्ष (अनुभवी)",
    farmingExp3: "10 से 20 वर्ष (विशेषज्ञ)",
    farmingExp4: "20+ वर्ष (वरिष्ठ किसान)",
    createFarmerAccount: "एग्री-रिज़ॉल्व के साथ शुरुआत करें",

    buyerRegTitle: "खरीदार पंजीकरण",
    buyerRegSubtitle: "उच्च गुणवत्ता वाली फसलों की सीधी खरीद हेतु जुड़ें",
    businessNameLabel: "व्यापार / प्रतिष्ठान का नाम",
    buyerContactLabel: "फ़ोन या ईमेल",
    buyerTypeLabel: "खरीदार की श्रेणी",
    cropsInterestedLabel: "इच्छित फसलें",
    createBuyerAccount: "खरीदार के रूप में पंजीकरण करें",

    myLandsTitle: "मेरे खेत और जमीनें",
    myLandsSubtitle: "प्रत्येक खेत का अलग मिट्टी, मौसम, सिंचाई और AI डेटा होता है।",
    landNameLabel: "खेत का नाम",
    areaLabel: "कुल क्षेत्रफल",
    areaUnitLabel: "इकाई",
    irrigationTypeLabel: "सिंचाई का प्रकार",
    currentCropLabel: "वर्तमान फसल",
    cropVarietyLabel: "फसल की किस्म",
    plantingDateLabel: "बुवाई की तारीख",
    cropStageLabel: "फसल की वर्तमान अवस्था",
    viewLandBtn: "खेत का डेटा देखें",
    manageLandBtn: "खेत प्रबंधित करें",
    landDetailsTitle: "खेत विवरण और सेटिंग्स",
    saveLandBtn: "खेत सहेजें",
    deleteLandBtn: "खेत हटाएं",
    landCreatedSuccess: "खेत सफलतापूर्वक जोड़ा गया!",

    soilHealthTitle: "मृदा स्वास्थ्य कार्ड (Soil Health Card)",
    soilHealthSubtitle: "स्वतंत्र मृदा पोषक तत्व परीक्षण कार्ड:",
    overallSoilStatus: "समग्र मिट्टी की गुणवत्ता",
    goodStatus: "उत्तम (GOOD)",
    moderateStatus: "मध्यम (MODERATE)",
    needsAttentionStatus: "ध्यान देने योग्य (NEEDS ATTENTION)",
    testDateLabel: "परीक्षण की तारीख",
    laboratoryLabel: "परीक्षण प्रयोगशाला / कृषि विज्ञान केंद्र",
    manualEntryTab: "सीधी प्रविष्टि",
    imageUploadTab: "फोटो अपलोड करें",
    pdfUploadTab: "PDF अपलोड करें",
    saveSoilCardBtn: "मृदा कार्ड अपडेट करें",
    soilGuidanceTitle: "मृदा सुधार हेतु सुझाव",
    dropFileOrBrowse: "अपना मृदा कार्ड यहां अपलोड करें",
    fileSelected: "फ़ाइल सफलतापूर्वक अपलोड हुई",
    extractingData: "मृदा कार्ड का विश्लेषण हो रहा है...",

    phLabel: "pH मान",
    nitrogenLabel: "नाइट्रोजन (N)",
    phosphorusLabel: "फास्फोरस (P)",
    potassiumLabel: "पोटेशियम (K)",
    organicCarbonLabel: "जैविक कार्बन (OC)",
    sulphurLabel: "सल्फर (S)",
    zincLabel: "जिंक (Zn)",
    ironLabel: "आयरन (Fe)",
    manganeseLabel: "मैंगनीज (Mn)",
    copperLabel: "कॉपर (Cu)",
    boronLabel: "बोरॉन (B)",
    ecLabel: "विद्युत चालकता (EC)",

    welcomeFarmer: "स्वागत है,",
    weatherTitle: "मौसम का पूर्वानुमान",
    currentCropTitle: "फसल की स्थिति",
    cropStageTitle: "विकास का चरण",
    irrigationStatusTitle: "सिंचाई सलाह",
    todayTasksTitle: "आज के कृषि कार्य",
    alertsTitle: "महत्वपूर्ण चेतावनियां",
    conflictResolverHeroTitle: "कृषि सिफारिश विवाद निवारक",
    conflictResolverHeroDesc: "हमने मिट्टी, मौसम, सिंचाई, योजना और कीट नियंत्रण की परस्पर विरोधी सलाहों को एक स्पष्ट कार्ययोजना में बदल दिया है।",
    openResolverBtn: "सुलझाया हुआ समाधान देखें",
    askAIBtn: "AI से सवाल पूछें",

    resolverTitle: "कृषि सिफारिश विवाद निवारक प्रणाली",
    resolverSubtitle: "मिट्टी, मौसम, सिंचाई, फसल योजना और फसल स्वास्थ्य का एक एकीकृत निष्कर्ष।",
    masterRecommendationLabel: "एकल एकीकृत व्यावहारिक सिफारिश",
    conflictDetectedBadge: "विरोधाभासी सलाहों का समाधान किया गया",
    noConflictBadge: "सभी प्रणालियों में पूर्ण सहमति",
    whyThisDecisionTitle: "इस निर्णय को प्राथमिकता क्यों दी गई?",
    confidenceScoreLabel: "AI सटीकता स्कोर",
    estimatedImpactLabel: "अनुमानित बचत / लाभ",
    systemInputsTitle: "मूल्यांकन की गई व्यक्तिगत प्रणालियों की सलाह",
    soilSystemLabel: "मृदा प्रणाली",
    weatherSystemLabel: "मौसम प्रणाली",
    irrigationSystemLabel: "सिंचाई प्रणाली",
    cropPlanningSystemLabel: "फसल योजना प्रणाली",
    cropHealthSystemLabel: "फसल स्वास्थ्य प्रणाली",
    runConflictCheckBtn: "पुनः विवाद जांच करें",
    analyzingSystems: "सभी 5 प्रणालियों का क्रॉस-विश्लेषण जारी है...",
    actionChecklistTitle: "किसान के लिए कार्य सूची",
    safetyPrecautionsTitle: "सुरक्षा एवं खाद बर्बादी चेतावनियां",
    resolveNewScenarioBtn: "नई परिस्थिति का परीक्षण करें",

    subTabLands: "मेरे खेत",
    subTabSoil: "मिट्टी",
    subTabPlanning: "फसल",
    subTabCalendar: "कैलेंडर",
    subTabIrrigation: "💧 पानी सलाह",
    subTabCropHealth: "📷 फसल जांचें",
    subTabResolver: "⚠️ अलग सलाह",
    subTabYield: "उपज का अनुमान",
    subTabMarket: "💰 फसल बेचें",
    subTabStorage: "भंडारण सलाहकार",
    subTabProfit: "मुनाफ़ा कैलकुलेटर",
    subTabLogistics: "परिवहन",
    subTabSchemes: "सरकारी योजनाएं",
    subTabSustainability: "टिकाऊ खेती",

    speakToAI: "🎤 AI से बोलकर पूछें",
    typeMessage: "⌨️ टाइप करें",
    uploadPhoto: "📷 फोटो अपलोड करें",
    todaysWorkTitle: "📋 आज का काम",
    ourSuggestionTitle: "🤖 हमारा सुझाव",
    whyTitle: "क्यों?",
    moreDetailsBtn: "अधिक विवरण",
    rainAlertTitle: "🌧️ बारिश अलर्ट",
    waterAlertTitle: "💧 पानी अलर्ट",
    cropAlertTitle: "🌱 फसल अलर्ट",
    marketAlertTitle: "💰 मंडी अलर्ट",
    farmAlertTitle: "⚠️ खेत अलर्ट",
    farmerCommunityTitle: "👨‍🌾 किसान समुदाय",
    askQuestionBtn: "❓ सवाल पूछें",
    seeAnswersBtn: "💬 जवाब देखें",
    whatShouldIDoTodayQuestion: "आज मुझे क्या करना चाहिए?",

    loading: "लोड हो रहा है...",
    saving: "सहेजा जा रहा है...",
    cancel: "रद्द करें",
    save: "सहेजें",
    edit: "संशोधित करें",
    delete: "हटाएं",
    search: "खोजें...",
    filter: "फ़िल्टर",
    close: "बंद करें",
    refresh: "ताज़ा करें",
    urgent: "अति आवश्यक",
    recommended: "अनुशंसित",
    completed: "पूर्ण",
    pending: "लंबित",
    errorRequired: "कृपया यह विवरण भरें",
    successSaved: "सफलतापूर्वक सहेजा गया!",
    logout: "लॉग आउट",
    settings: "सेटिंग्स",
    notifications: "सूचनाएं",
    privacy: "गोपनीयता नीति",
    helpAndSupport: "सहायता एवं किसान हेल्पलाइन",
    aboutAgriResolve: "एग्री-रिज़ॉल्व के बारे में",
    kisanHelpline: "किसान कॉल सेंटर: 1800-180-1551 (टोल फ्री)"
  }
};
