# SpreadsheetTable Test Data

This directory contains fake data and demo components for testing the `SpreadsheetTable` component.

## Files

- **`fakeLeadsData.ts`** - Contains 15 predefined fake leads and a helper function to generate more
- **`SpreadsheetTableDemo.tsx`** - A demo component that shows how to use SpreadsheetTable with fake data

## Quick Start

### Using Predefined Fake Data

```tsx
import { fakeLeads } from "@/shared/components/crm/__test__/fakeLeadsData";
import { SpreadsheetTable } from "@/shared/components/crm/SpreadsheetTable";

function MyComponent() {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  return (
    <SpreadsheetTable
      leads={fakeLeads}
      selectedLeads={selectedLeads}
      onSelectAll={(checked) => {
        setSelectedLeads(checked ? fakeLeads.map((l) => l.id) : []);
      }}
      onToggleSelect={(id) => {
        setSelectedLeads((prev) =>
          prev.includes(id)
            ? prev.filter((leadId) => leadId !== id)
            : [...prev, id]
        );
      }}
      onUpdate={() => {
        console.log("Data updated");
      }}
    />
  );
}
```

### Generating More Fake Data

```tsx
import { generateFakeLeads } from "@/shared/components/crm/__test__/fakeLeadsData";

// Generate 50 fake leads
const leads = generateFakeLeads(50);
```

### Using the Demo Component

```tsx
import { SpreadsheetTableDemo } from "@/shared/components/crm/__test__/SpreadsheetTableDemo";

// Use the demo component directly
<SpreadsheetTableDemo />;
```

## Data Structure

Each lead object contains:

- `id` - Unique identifier (string)
- `company` - Company name (string | null)
- `name` - Contact name (string | null)
- `email` - Email address (string | null)
- `phone` - Phone number (string | null)
- `source` - Lead source (GOOGLE_MAPS | LINKEDIN | REFERRAL | COLD_OUTREACH | TRADE_SHOW | WEBSITE | OTHER)
- `businessType` - Type of business (SIGN_COMPANY | BILLBOARD_OPERATOR | WRAP_INSTALLER | PROPERTY_MANAGER | PRINT_SHOP | AGENCY | OTHER)
- `location` - Location string (string | null)
- `hasInventory` - Has inventory flag (YES | NO | UNKNOWN)
- `inventoryType` - Type of inventory (BILLBOARD | STOREFRONT | TRANSIT | DIGITAL_DISPLAY | WINDOW_DISPLAY | VEHICLE_WRAP | OTHER | null)
- `estimatedSpaces` - Estimated number of spaces (number | null)
- `hasInstallCapability` - Installation capability (YES | NO | UNKNOWN)
- `status` - Lead status (NEW | CONTACTED | RESPONDED | DEMO_SCHEDULED | SIGNED_UP | FOLLOW_UP | NOT_INTERESTED)
- `lastContactDate` - Last contact date (Date | null)
- `nextAction` - Next action item (string | null)
- `priorityScore` - Priority score 1-5 (number)
- `phase1Qualified` - Phase 1 qualification flag (boolean)
- `notes` - Additional notes (string | null)

## Testing Tips

1. **Test Selection**: Use the checkbox column to test selecting individual leads or all leads
2. **Test Editing**: Click on any editable cell to test the inline editing functionality
3. **Test Filtering**: The fake data includes various statuses, sources, and business types for testing filters
4. **Test Phase 1**: Some leads have `phase1Qualified: true` which adds a green left border
5. **Test Priority Scores**: Leads have priority scores from 1-5 to test the priority display
