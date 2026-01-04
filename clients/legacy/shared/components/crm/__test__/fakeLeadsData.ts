/**
 * Fake data for testing SpreadsheetTable component
 * This file contains sample lead data matching the expected structure
 */

export interface FakeLead {
  id: string;
  company: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string;
  businessType: string;
  location: string | null;
  hasInventory: string; // 'YES' | 'NO' | 'UNKNOWN'
  inventoryType: string | null;
  estimatedSpaces: number | null;
  hasInstallCapability: string; // 'YES' | 'NO' | 'UNKNOWN'
  status: string;
  lastContactDate: Date | null;
  nextAction: string | null;
  priorityScore: number;
  phase1Qualified: boolean;
  notes: string | null;
}

export const fakeLeads: FakeLead[] = [
  {
    id: "lead_01h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Metro Billboard Co",
    name: "Sarah Johnson",
    email: "sarah.j@metrobillboard.com",
    phone: "+1 (555) 234-5678",
    source: "GOOGLE_MAPS",
    businessType: "BILLBOARD_OPERATOR",
    location: "Los Angeles, CA",
    hasInventory: "YES",
    inventoryType: "BILLBOARD",
    estimatedSpaces: 45,
    hasInstallCapability: "YES",
    status: "DEMO_SCHEDULED",
    lastContactDate: new Date("2024-01-15"),
    nextAction: "Follow up on demo scheduled for next week",
    priorityScore: 5,
    phase1Qualified: true,
    notes:
      "Very interested in digital displays. Has 45 billboard locations across LA county.",
  },
  {
    id: "lead_02h8x9k2m3n4p5q6r7s8t9u0v",
    company: "City Signs & Graphics",
    name: "Michael Chen",
    email: "mchen@citysigns.com",
    phone: "+1 (555) 345-6789",
    source: "LINKEDIN",
    businessType: "SIGN_COMPANY",
    location: "San Francisco, CA",
    hasInventory: "YES",
    inventoryType: "STOREFRONT",
    estimatedSpaces: 12,
    hasInstallCapability: "YES",
    status: "RESPONDED",
    lastContactDate: new Date("2024-01-10"),
    nextAction: "Send pricing information",
    priorityScore: 4,
    phase1Qualified: true,
    notes: "Looking to expand their storefront advertising offerings.",
  },
  {
    id: "lead_03h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Transit Media Group",
    name: "Emily Rodriguez",
    email: "emily.r@transitmedia.com",
    phone: "+1 (555) 456-7890",
    source: "REFERRAL",
    businessType: "BILLBOARD_OPERATOR",
    location: "New York, NY",
    hasInventory: "YES",
    inventoryType: "TRANSIT",
    estimatedSpaces: 200,
    hasInstallCapability: "NO",
    status: "CONTACTED",
    lastContactDate: new Date("2024-01-08"),
    nextAction: "Wait for response to initial email",
    priorityScore: 5,
    phase1Qualified: true,
    notes: "Large transit advertising company. Referred by existing partner.",
  },
  {
    id: "lead_04h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Wrap Masters Inc",
    name: "David Kim",
    email: "david@wrapmasters.com",
    phone: "+1 (555) 567-8901",
    source: "TRADE_SHOW",
    businessType: "WRAP_INSTALLER",
    location: "Chicago, IL",
    hasInventory: "NO",
    inventoryType: null,
    estimatedSpaces: null,
    hasInstallCapability: "YES",
    status: "NEW",
    lastContactDate: null,
    nextAction: "Initial outreach email",
    priorityScore: 3,
    phase1Qualified: false,
    notes:
      "Met at trade show. Specializes in vehicle wraps but interested in expanding.",
  },
  {
    id: "lead_05h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Premier Property Management",
    name: "Jennifer Martinez",
    email: "j.martinez@premierpm.com",
    phone: "+1 (555) 678-9012",
    source: "WEBSITE",
    businessType: "PROPERTY_MANAGER",
    location: "Miami, FL",
    hasInventory: "YES",
    inventoryType: "STOREFRONT",
    estimatedSpaces: 8,
    hasInstallCapability: "UNKNOWN",
    status: "RESPONDED",
    lastContactDate: new Date("2024-01-12"),
    nextAction: "Schedule discovery call",
    priorityScore: 4,
    phase1Qualified: true,
    notes:
      "Manages multiple commercial properties. Interested in monetizing storefronts.",
  },
  {
    id: "lead_06h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Digital Print Solutions",
    name: "Robert Taylor",
    email: "rtaylor@digitalprint.com",
    phone: "+1 (555) 789-0123",
    source: "COLD_OUTREACH",
    businessType: "PRINT_SHOP",
    location: "Seattle, WA",
    hasInventory: "UNKNOWN",
    inventoryType: null,
    estimatedSpaces: null,
    hasInstallCapability: "UNKNOWN",
    status: "CONTACTED",
    lastContactDate: new Date("2024-01-05"),
    nextAction: "Follow up - no response yet",
    priorityScore: 2,
    phase1Qualified: false,
    notes: "Cold outreach. Print shop that might have display opportunities.",
  },
  {
    id: "lead_07h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Creative Ad Agency",
    name: "Lisa Anderson",
    email: "lisa@creativead.com",
    phone: "+1 (555) 890-1234",
    source: "LINKEDIN",
    businessType: "AGENCY",
    location: "Austin, TX",
    hasInventory: "NO",
    inventoryType: null,
    estimatedSpaces: null,
    hasInstallCapability: "NO",
    status: "FOLLOW_UP",
    lastContactDate: new Date("2024-01-14"),
    nextAction: "Send case studies",
    priorityScore: 3,
    phase1Qualified: false,
    notes:
      "Agency looking for inventory for clients. Not a direct fit but potential partner.",
  },
  {
    id: "lead_08h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Highway Billboard Network",
    name: "James Wilson",
    email: "jwilson@highwaybillboard.net",
    phone: "+1 (555) 901-2345",
    source: "GOOGLE_MAPS",
    businessType: "BILLBOARD_OPERATOR",
    location: "Phoenix, AZ",
    hasInventory: "YES",
    inventoryType: "BILLBOARD",
    estimatedSpaces: 78,
    hasInstallCapability: "YES",
    status: "SIGNED_UP",
    lastContactDate: new Date("2024-01-18"),
    nextAction: "Onboarding call scheduled",
    priorityScore: 5,
    phase1Qualified: true,
    notes:
      "Successfully converted! Large billboard operator with 78 locations.",
  },
  {
    id: "lead_09h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Urban Window Displays",
    name: "Amanda White",
    email: "amanda@urbanwindows.com",
    phone: "+1 (555) 012-3456",
    source: "REFERRAL",
    businessType: "SIGN_COMPANY",
    location: "Portland, OR",
    hasInventory: "YES",
    inventoryType: "WINDOW_DISPLAY",
    estimatedSpaces: 25,
    hasInstallCapability: "YES",
    status: "DEMO_SCHEDULED",
    lastContactDate: new Date("2024-01-16"),
    nextAction: "Prepare demo materials",
    priorityScore: 4,
    phase1Qualified: true,
    notes:
      "Specializes in window displays for retail. Strong referral from existing customer.",
  },
  {
    id: "lead_10h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Express Vehicle Wraps",
    name: "Thomas Brown",
    email: "thomas@expresswraps.com",
    phone: "+1 (555) 123-4567",
    source: "TRADE_SHOW",
    businessType: "WRAP_INSTALLER",
    location: "Denver, CO",
    hasInventory: "NO",
    inventoryType: null,
    estimatedSpaces: null,
    hasInstallCapability: "YES",
    status: "NOT_INTERESTED",
    lastContactDate: new Date("2024-01-03"),
    nextAction: "Archive - not interested",
    priorityScore: 1,
    phase1Qualified: false,
    notes: "Not interested in expanding beyond vehicle wraps at this time.",
  },
  {
    id: "lead_11h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Metro Transit Advertising",
    name: "Patricia Davis",
    email: "pdavis@metrotran.com",
    phone: "+1 (555) 234-5678",
    source: "WEBSITE",
    businessType: "BILLBOARD_OPERATOR",
    location: "Boston, MA",
    hasInventory: "YES",
    inventoryType: "TRANSIT",
    estimatedSpaces: 150,
    hasInstallCapability: "YES",
    status: "RESPONDED",
    lastContactDate: new Date("2024-01-17"),
    nextAction: "Send detailed proposal",
    priorityScore: 5,
    phase1Qualified: true,
    notes:
      "Large transit advertising network. Very interested in digital displays.",
  },
  {
    id: "lead_12h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Storefront Solutions LLC",
    name: "Christopher Lee",
    email: "chris@storefrontsol.com",
    phone: "+1 (555) 345-6789",
    source: "LINKEDIN",
    businessType: "PROPERTY_MANAGER",
    location: "Nashville, TN",
    hasInventory: "YES",
    inventoryType: "STOREFRONT",
    estimatedSpaces: 15,
    hasInstallCapability: "UNKNOWN",
    status: "CONTACTED",
    lastContactDate: new Date("2024-01-11"),
    nextAction: "Wait for response",
    priorityScore: 3,
    phase1Qualified: false,
    notes: "Property management company with storefront locations.",
  },
  {
    id: "lead_13h8x9k2m3n4p5q6r7s8t9u0v",
    company: null,
    name: "Rachel Green",
    email: "rachel.green@email.com",
    phone: "+1 (555) 456-7890",
    source: "COLD_OUTREACH",
    businessType: "OTHER",
    location: "Atlanta, GA",
    hasInventory: "UNKNOWN",
    inventoryType: null,
    estimatedSpaces: null,
    hasInstallCapability: "UNKNOWN",
    status: "NEW",
    lastContactDate: null,
    nextAction: "Qualify lead - gather more information",
    priorityScore: 1,
    phase1Qualified: false,
    notes: "Individual contact. Need to determine business type and inventory.",
  },
  {
    id: "lead_14h8x9k2m3n4p5q6r7s8t9u0v",
    company: "Digital Billboard Network",
    name: "Mark Thompson",
    email: "mark.t@digitalbillboard.com",
    phone: "+1 (555) 567-8901",
    source: "GOOGLE_MAPS",
    businessType: "BILLBOARD_OPERATOR",
    location: "Dallas, TX",
    hasInventory: "YES",
    inventoryType: "DIGITAL_DISPLAY",
    estimatedSpaces: 92,
    hasInstallCapability: "YES",
    status: "FOLLOW_UP",
    lastContactDate: new Date("2024-01-13"),
    nextAction: "Schedule technical consultation",
    priorityScore: 5,
    phase1Qualified: true,
    notes: "Already has digital displays. Looking to expand network.",
  },
  {
    id: "lead_15h8x9k2m3n4p5q6r7s8t9u0v",
    company: "City Print & Sign",
    name: "Nancy Garcia",
    email: "nancy@cityprint.com",
    phone: "+1 (555) 678-9012",
    source: "REFERRAL",
    businessType: "PRINT_SHOP",
    location: "Minneapolis, MN",
    hasInventory: "YES",
    inventoryType: "STOREFRONT",
    estimatedSpaces: 6,
    hasInstallCapability: "NO",
    status: "RESPONDED",
    lastContactDate: new Date("2024-01-09"),
    nextAction: "Discuss installation partner options",
    priorityScore: 3,
    phase1Qualified: false,
    notes:
      "Print shop with storefront locations but no installation capability.",
  },
];

/**
 * Helper function to generate more fake leads
 * @param count - Number of leads to generate
 * @returns Array of fake leads
 */
export function generateFakeLeads(count: number): FakeLead[] {
  const sources = [
    "GOOGLE_MAPS",
    "LINKEDIN",
    "REFERRAL",
    "COLD_OUTREACH",
    "TRADE_SHOW",
    "WEBSITE",
    "OTHER",
  ];
  const businessTypes = [
    "SIGN_COMPANY",
    "BILLBOARD_OPERATOR",
    "WRAP_INSTALLER",
    "PROPERTY_MANAGER",
    "PRINT_SHOP",
    "AGENCY",
    "OTHER",
  ];
  const inventoryTypes = [
    null,
    "BILLBOARD",
    "STOREFRONT",
    "TRANSIT",
    "DIGITAL_DISPLAY",
    "WINDOW_DISPLAY",
    "VEHICLE_WRAP",
    "OTHER",
  ];
  const statuses = [
    "NEW",
    "CONTACTED",
    "RESPONDED",
    "DEMO_SCHEDULED",
    "SIGNED_UP",
    "FOLLOW_UP",
    "NOT_INTERESTED",
  ];
  const hasInventoryOptions = ["YES", "NO", "UNKNOWN"];
  const hasInstallOptions = ["YES", "NO", "UNKNOWN"];

  const companies = [
    "Metro Signs",
    "City Graphics",
    "Urban Displays",
    "Premier Advertising",
    "Digital Media Co",
    "Express Signs",
    "Highway Media",
    "Transit Ads",
    "Window Solutions",
    "Billboard Network",
  ];

  const firstNames = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Quinn",
    "Avery",
    "Sage",
    "River",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ];

  const cities = [
    "Los Angeles, CA",
    "New York, NY",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
  ];

  const leads: FakeLead[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company
      .toLowerCase()
      .replace(/\s+/g, "")}.com`;
    const phone = `+1 (555) ${Math.floor(
      100 + Math.random() * 900
    )}-${Math.floor(1000 + Math.random() * 9000)}`;
    const source = sources[Math.floor(Math.random() * sources.length)];
    const businessType =
      businessTypes[Math.floor(Math.random() * businessTypes.length)];
    const location = cities[Math.floor(Math.random() * cities.length)];
    const hasInventory =
      hasInventoryOptions[
        Math.floor(Math.random() * hasInventoryOptions.length)
      ];
    const inventoryType =
      hasInventory === "YES"
        ? inventoryTypes[
            Math.floor(Math.random() * (inventoryTypes.length - 1)) + 1
          ]
        : null;
    const estimatedSpaces =
      hasInventory === "YES" ? Math.floor(Math.random() * 200) + 1 : null;
    const hasInstallCapability =
      hasInstallOptions[Math.floor(Math.random() * hasInstallOptions.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const lastContactDate =
      status !== "NEW"
        ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        : null;
    const priorityScore = Math.floor(Math.random() * 5) + 1;
    const phase1Qualified = priorityScore >= 4;

    leads.push({
      id: `lead_${Math.random().toString(36).substring(2, 15)}${Math.random()
        .toString(36)
        .substring(2, 15)}`,
      company,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      source,
      businessType,
      location,
      hasInventory,
      inventoryType,
      estimatedSpaces,
      hasInstallCapability,
      status,
      lastContactDate,
      nextAction: `Next action for ${firstName}`,
      priorityScore,
      phase1Qualified,
      notes: `Notes for ${company}`,
    });
  }

  return leads;
}
