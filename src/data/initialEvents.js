export const INITIAL_EVENTS = [
  {
    id: "evt-winter-bump",
    name: "Winter Bump",
    location: "Myrtle Beach, SC",
    venue: "Myrtle Beach Convention Center & Sports Center",
    startDate: "2027-01-16",
    endDate: "2027-01-18",
    displayDates: "Jan 16–18, 2027",
    category: "Regular Tournament",
    requiresQualification: false,
    notes: "Season opener! Pack warm gear for outside.",
    
    // Stay & Play / Hotel details
    hotelStatus: "not_started", // 'not_started' | 'email_received' | 'deadline_set' | 'booked' | 'not_required'
    hotelEmailDate: "",
    hotelDeadline: "2026-11-20",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-01-15",
    checkOutDate: "2027-01-18",
    hotelCost: "",
    hotelNotes: "",

    // Flight & Travel details
    travelMode: "driving", // 'driving' | 'flying' | 'tbd'
    flightStatus: "not_needed", // 'not_needed' | 'needed' | 'booked'
    flightOutbound: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "", to: "" },
    flightReturn: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "Approx 4.5 hour drive. Carpool with Sarah's family?",

    checklist: [
      { id: "c1", text: "Receive Stay & Play email from club", completed: false },
      { id: "c2", text: "Book team hotel before deadline", completed: false },
      { id: "c3", text: "Verify jersey numbers for roster", completed: false }
    ]
  },
  {
    id: "evt-queen-city",
    name: "Queen City Classic",
    location: "Charlotte, NC",
    venue: "Charlotte Convention Center",
    startDate: "2027-02-06",
    endDate: "2027-02-07",
    displayDates: "Feb 6–7, 2027",
    category: "Regular Tournament",
    requiresQualification: false,
    notes: "2-day weekend event. Drive in Friday evening.",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2026-12-05",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-02-05",
    checkOutDate: "2027-02-07",
    hotelCost: "",
    hotelNotes: "",

    travelMode: "driving",
    flightStatus: "not_needed",
    flightOutbound: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "", to: "" },
    flightReturn: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "",

    checklist: [
      { id: "qc1", text: "Book hotel block", completed: false }
    ]
  },
  {
    id: "evt-washington-birthday",
    name: "Washington's Birthday Bash",
    location: "Rocky Mount, NC",
    venue: "Rocky Mount Event Center",
    startDate: "2027-02-13",
    endDate: "2027-02-14",
    displayDates: "Feb 13–14, 2027",
    category: "Regular Tournament",
    requiresQualification: false,
    notes: "Holiday weekend tournament.",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2026-12-12",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-02-12",
    checkOutDate: "2027-02-14",
    hotelCost: "",
    hotelNotes: "",

    travelMode: "driving",
    flightStatus: "not_needed",
    flightOutbound: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "", to: "" },
    flightReturn: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "",

    checklist: [
      { id: "wb1", text: "Check hotel availability", completed: false }
    ]
  },
  {
    id: "evt-sunshine-qualifier",
    name: "Sunshine Volleyball Classic Qualifier",
    location: "Orlando, FL",
    venue: "Orange County Convention Center",
    startDate: "2027-03-18",
    endDate: "2027-03-21",
    displayDates: "Mar 18–21, 2027",
    category: "Qualifier",
    requiresQualification: false,
    notes: "National Qualifier! Flight recommended.",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2027-01-15",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-03-17",
    checkOutDate: "2027-03-21",
    hotelCost: "",
    hotelNotes: "Mandatory Stay and Play event.",

    travelMode: "flying",
    flightStatus: "needed",
    flightOutbound: { airline: "", flightNum: "", date: "2027-03-17", depTime: "", arrTime: "", from: "", to: "MCO" },
    flightReturn: { airline: "", flightNum: "", date: "2027-03-21", depTime: "", arrTime: "", from: "MCO", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "Fly into MCO. Book flight once waves are released.",

    checklist: [
      { id: "sq1", text: "Stay & Play hotel reservation mandatory", completed: false },
      { id: "sq2", text: "Book flights for player + parent", completed: false }
    ]
  },
  {
    id: "evt-mideast-qualifier",
    name: "Mid-East Qualifier",
    location: "Indianapolis, IN",
    venue: "Indiana Convention Center",
    startDate: "2027-03-19",
    endDate: "2027-03-21",
    displayDates: "Mar 19–21, 2027",
    category: "Qualifier",
    requiresQualification: false,
    notes: "MEQ Qualifier weekend.",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2027-01-20",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-03-18",
    checkOutDate: "2027-03-21",
    hotelCost: "",
    hotelNotes: "",

    travelMode: "flying",
    flightStatus: "needed",
    flightOutbound: { airline: "", flightNum: "", date: "2027-03-18", depTime: "", arrTime: "", from: "", to: "IND" },
    flightReturn: { airline: "", flightNum: "", date: "2027-03-21", depTime: "", arrTime: "", from: "IND", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "",

    checklist: [
      { id: "meq1", text: "Book downtown skywalk hotel if available", completed: false }
    ]
  },
  {
    id: "evt-big-south-qualifier",
    name: "Big South Qualifier",
    location: "Atlanta, GA",
    venue: "Georgia World Congress Center",
    startDate: "2027-03-26",
    endDate: "2027-03-28",
    displayDates: "Mar 26–28, 2027",
    category: "Qualifier",
    requiresQualification: false,
    notes: "Huge qualifier! Strict Stay & Play compliance.",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2027-01-25",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-03-25",
    checkOutDate: "2027-03-28",
    hotelCost: "",
    hotelNotes: "THS / Team Travel Source portal.",

    travelMode: "flying",
    flightStatus: "needed",
    flightOutbound: { airline: "", flightNum: "", date: "2027-03-25", depTime: "", arrTime: "", from: "", to: "ATL" },
    flightReturn: { airline: "", flightNum: "", date: "2027-03-28", depTime: "", arrTime: "", from: "ATL", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "MARTA subway available directly to GWCC.",

    checklist: [
      { id: "bsq1", text: "Secure Stay & Play room code from team rep", completed: false }
    ]
  },
  {
    id: "evt-slc-qualifier",
    name: "Salt Lake City Qualifier",
    location: "Salt Lake City, UT",
    venue: "Salt Palace Convention Center",
    startDate: "2027-04-02",
    endDate: "2027-04-04",
    displayDates: "Apr 2–4, 2027",
    category: "Qualifier",
    requiresQualification: false,
    notes: "Easter weekend qualifier in SLC.",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2027-02-01",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-04-01",
    checkOutDate: "2027-04-04",
    hotelCost: "",
    hotelNotes: "",

    travelMode: "flying",
    flightStatus: "needed",
    flightOutbound: { airline: "", flightNum: "", date: "2027-04-01", depTime: "", arrTime: "", from: "", to: "SLC" },
    flightReturn: { airline: "", flightNum: "", date: "2027-04-04", depTime: "", arrTime: "", from: "SLC", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "High altitude - bring extra hydration tabs.",

    checklist: [
      { id: "slc1", text: "Book flight to SLC", completed: false }
    ]
  },
  {
    id: "evt-ne-qualifier",
    name: "Northeast Qualifier",
    location: "Philadelphia, PA",
    venue: "Pennsylvania Convention Center",
    startDate: "2027-04-23",
    endDate: "2027-04-25",
    displayDates: "Apr 23–25, 2027",
    category: "Qualifier",
    requiresQualification: false,
    notes: "NEQ Qualifier.",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2027-02-15",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-04-22",
    checkOutDate: "2027-04-25",
    hotelCost: "",
    hotelNotes: "",

    travelMode: "flying",
    flightStatus: "needed",
    flightOutbound: { airline: "", flightNum: "", date: "2027-04-22", depTime: "", arrTime: "", from: "", to: "PHL" },
    flightReturn: { airline: "", flightNum: "", date: "2027-04-25", depTime: "", arrTime: "", from: "PHL", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "",

    checklist: [
      { id: "neq1", text: "Hotel deadline check", completed: false }
    ]
  },
  {
    id: "evt-coastal-classic",
    name: "Coastal Classic",
    location: "Myrtle Beach, SC",
    venue: "Myrtle Beach Sports Center",
    startDate: "2027-06-05",
    endDate: "2027-06-06",
    displayDates: "Jun 5–6, 2027",
    category: "Regular Tournament",
    requiresQualification: false,
    notes: "Pre-nationals tuneup tournament.",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2027-04-10",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-06-04",
    checkOutDate: "2027-06-06",
    hotelCost: "",
    hotelNotes: "",

    travelMode: "driving",
    flightStatus: "not_needed",
    flightOutbound: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "", to: "" },
    flightReturn: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "",

    checklist: [
      { id: "cc1", text: "Book oceanfront hotel block", completed: false }
    ]
  },
  {
    id: "evt-aau-nationals",
    name: "AAU National",
    location: "Orlando, FL",
    venue: "Orange County Convention Center / ESPN Wide World of Sports",
    startDate: "2027-06-13",
    endDate: "2027-06-28",
    displayDates: "Jun 13–28, 2027",
    category: "National Championship",
    requiresQualification: false,
    notes: "Major marquee event! Specific wave dates depend on division (usually 4 days total within this window).",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2027-03-30",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-06-13",
    checkOutDate: "2027-06-18",
    hotelCost: "",
    hotelNotes: "Verify exact wave block days once wave schedules drop in May.",

    travelMode: "flying",
    flightStatus: "needed",
    flightOutbound: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "", to: "MCO" },
    flightReturn: { airline: "", flightNum: "", date: "", depTime: "", arrTime: "", from: "MCO", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "Consider car rental for ESPN Wide World of Sports transport.",

    checklist: [
      { id: "aau1", text: "Check AAU membership active", completed: false },
      { id: "aau2", text: "Book hotel block via AAU Housing", completed: false }
    ]
  },
  {
    id: "evt-usav-nationals",
    name: "USAV National",
    location: "Las Vegas, NV",
    venue: "Las Vegas Convention Center",
    startDate: "2027-07-02",
    endDate: "2027-07-05",
    displayDates: "Jul 2–5, 2027",
    category: "National Championship",
    requiresQualification: true,
    notes: "⚠️ Requires Qualification from a National Qualifier! Keep track of bid status.",
    
    hotelStatus: "not_started",
    hotelEmailDate: "",
    hotelDeadline: "2027-05-15",
    hotelBookingCode: "",
    hotelBookingUrl: "",
    hotelName: "",
    hotelConfirmation: "",
    checkInDate: "2027-07-01",
    checkOutDate: "2027-07-05",
    hotelCost: "",
    hotelNotes: "Book conditional housing or official USAV hotel block.",

    travelMode: "flying",
    flightStatus: "needed",
    flightOutbound: { airline: "", flightNum: "", date: "2027-07-01", depTime: "", arrTime: "", from: "", to: "LAS" },
    flightReturn: { airline: "", flightNum: "", date: "2027-07-05", depTime: "", arrTime: "", from: "LAS", to: "" },
    flightConfirmation: "",
    flightCost: "",
    carRental: { booked: false, company: "", confirmation: "" },
    travelNotes: "Fourth of July holiday weekend flights book early.",

    checklist: [
      { id: "usav1", text: "Earn Bid at Qualifier", completed: false },
      { id: "usav2", text: "Book USAV Stay & Play hotel once bid secured", completed: false }
    ]
  }
];
