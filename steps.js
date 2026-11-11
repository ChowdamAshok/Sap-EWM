// All lesson content lives here. Edit names/values freely.
const C = "BMWI"; // BMW India: your own object name (company code, plant, sales org ...)
const Z = (x, y, n, e, i) => ({ x, y, n, e, i });
const FLOOR = {
  vendor: Z(9, 15, "Vendor", "🏭", "The supplier who ships the goods to you."),
  door_in: Z(
    32,
    15,
    "Inbound door",
    "🚪",
    "Dock door where the truck is unloaded.",
  ),
  gr: Z(
    57,
    15,
    "GR zone",
    "🟨",
    "Goods receipt zone (storage type 9010). Goods wait here until putaway is confirmed.",
  ),
  erp: Z(
    12,
    50,
    "S/4HANA ERP",
    "🖥️",
    "Purchase orders, sales orders, deliveries, ERP stock (MMBE) and invoices.",
  ),
  ewm: Z(
    46,
    50,
    "EWM",
    "🧠",
    "Creates warehouse tasks and orders, keeps bin-level stock.",
  ),
  bins: Z(
    86,
    50,
    "Storage bin",
    "🗄️",
    "Bin in storage type 0010 where stock is put away and picked.",
  ),
  pack: Z(62, 85, "Pick & pack", "🧰", "Staging and packing area."),
  door_out: Z(
    35,
    85,
    "GI zone / door",
    "🚪",
    "Goods issue zone (storage type 9020) and outbound door.",
  ),
  customer: Z(9, 85, "Customer", "🛒", "The buyer who receives the goods."),
};
const STOCK = {
  s1000: "MMBE: SLoc 1000 stock",
  s5000: "MMBE: SLoc 5000 stock",
  s6000: "MMBE: SLoc 6000 stock",
  po: "Open PO qty (ordered, not stock)",
  ibd: "Inbound delivery qty (expected)",
  so: "Open sales order qty",
  dlv: "Outbound delivery qty (to ship)",
  gr: "EWM: GR zone",
  bin: "EWM: Storage bin",
  gi: "EWM: GI zone",
  cust: "Issued to customer",
};
const ZSTOCK = { gr: "gr", bins: "bin", door_out: "gi", customer: "cust" };
const NM = Z(
  12,
  50,
  "NMEG (SAP sample)",
  "📑",
  "SAP's ready-made sample data. In class you copy from it instead of building from zero.",
);

// move = [from, to, icon, what happens, document log, stock change]
const STEPS = [
  {
    g: "1. Enterprise structure (SPRO)",
    t: "Define company and company code",
    tc: "SPRO → SAP Reference IMG → Enterprise Structure → Definition → Financial Accounting",
    d: "Start in customizing. Copy the sample company and company code, then rename them.",
    f: [
      "Define Company: select NMEG, click Copy",
      "Company " +
        C +
        ", name BMW India Company, short description, save and enter request",
      "Address: street, postal 12345, New York, country US, region NY, leave time zone",
      "Edit/Copy company code: NMEG → " +
        C +
        ". Answer Yes, Yes and No for 'copy to target'",
    ],
    z: {
      spro: Z(
        10,
        50,
        "SPRO",
        "⚙️",
        "Customizing screen where all configuration is done.",
      ),
      nm: Z(42, 50, "NMEG (sample)", "📑", NM.i),
      co: Z(
        82,
        22,
        "Company " + C,
        "🏢",
        "BMW India Company, the legal entity.",
      ),
      cc: Z(82, 78, "Company code " + C, "🏛️", "Books of BMW India Company."),
    },
    m: [
      [
        "spro",
        "nm",
        "🖱️",
        "Open Define Company and select the sample NMEG.",
        "Opened Define Company",
      ],
      [
        "nm",
        "co",
        "📋",
        "Copy to new company and save with a request.",
        "Company " + C + " created",
      ],
      [
        "nm",
        "cc",
        "📋",
        "Copy company code NMEG to " + C + " (Yes, Yes, No).",
        "Company code " + C + " created",
      ],
    ],
  },
  {
    g: "1. Enterprise structure (SPRO)",
    t: "Plant, sales organization, channel, office, group",
    tc: "Enterprise Structure → Definition → Logistics General / Sales and Distribution",
    d: "Copy each object from NMEG and rename it. This creates your plants and your sales structure.",
    f: [
      "Logistics General: Copy plant from NMEG, check it in Define Plant",
      "Sales org: copy from NMEG; distribution channel and division: copy, check data",
      "Maintain sales office (copy) and sales group (new entity)",
    ],
    z: {
      nm: NM,
      pl: Z(76, 12, "Plant " + C, "🏭", "Location that makes or stores goods."),
      so: Z(76, 31, "Sales org " + C, "💼", "Sells the goods."),
      dc: Z(
        76,
        50,
        "Distr. channel / division",
        "🔀",
        "How and what you sell.",
      ),
      sf: Z(76, 69, "Sales office", "🏪", "Regional sales unit."),
      sg: Z(76, 88, "Sales group", "👥", "Team inside a sales office."),
    },
    m: [
      [
        "nm",
        "pl",
        "📋",
        "Copy plant NMEG, check under Define Plant.",
        "Plant " + C + " defined",
      ],
      [
        "nm",
        "so",
        "📋",
        "Copy sales organization.",
        "Sales org " + C + " defined",
      ],
      [
        "nm",
        "dc",
        "📋",
        "Copy distribution channel and division.",
        "Channel 01 / division 01 defined",
      ],
      [
        "nm",
        "sf",
        "📋",
        "Maintain sales office by copying.",
        "Sales office defined",
      ],
      [
        "nm",
        "sg",
        "➕",
        "New entity for sales group, save.",
        "Sales group defined",
      ],
    ],
  },
  {
    g: "1. Enterprise structure (SPRO)",
    t: "Storage locations, purchasing org, warehouse, shipping point",
    tc: "Material Management, Logistics Execution",
    d: "Create the stock and purchasing side: storage locations, a purchasing organization, a warehouse number and a shipping point.",
    f: [
      "Maintain storage location: check 1000, 5000, 6000",
      "Maintain purchasing organization: new, with description, save",
      "Logistics Execution: copy warehouse number (NMEG or ACN)",
      "Define shipping point: copy from NMEG",
    ],
    z: {
      nm: NM,
      sl: Z(
        76,
        15,
        "Storage loc. 1000/5000/6000",
        "🗄️",
        "Stock places inside plants.",
      ),
      po: Z(76, 38, "Purchasing org", "🧾", "Buys from vendors."),
      wh: Z(76, 62, "Warehouse number", "🏬", "Top EWM unit."),
      sp: Z(76, 85, "Shipping point", "🚚", "Where deliveries leave from."),
    },
    m: [
      [
        "nm",
        "sl",
        "✅",
        "Check storage locations 1000, 5000, 6000.",
        "Storage locations checked",
      ],
      [
        "nm",
        "po",
        "➕",
        "New purchasing organization, description, save.",
        "Purchasing org created",
      ],
      [
        "nm",
        "wh",
        "📋",
        "Copy warehouse number from NMEG or ACN.",
        "Warehouse number copied",
      ],
      [
        "nm",
        "sp",
        "📋",
        "Copy shipping point from NMEG.",
        "Shipping point created",
      ],
    ],
  },
  {
    g: "1. Enterprise structure (SPRO)",
    t: "Assignments: connect everything",
    tc: "Enterprise Structure → Assignment",
    d: "Created objects are separate until you assign them. Each assignment tells SAP which object belongs to which.",
    f: [
      "Financial: company → company code",
      "Logistics General: plant → company code (delete sample entry, add new entity)",
      "Sales: sales org → company code; distribution channel and division → sales org; sales office → sales area; sales group → sales office",
      "Check sales org - distribution channel - plant",
      "Logistics Execution: assign warehouse to plant/storage locations; assign shipping point to plant",
    ],
    z: {
      co: Z(12, 15, "Company", "🏢", "Top unit."),
      pl: Z(12, 50, "Plant", "🏭", "Plant."),
      so: Z(12, 85, "Sales org", "💼", "Sales org."),
      cc: Z(48, 50, "Company code", "🏛️", "Everything hangs under it."),
      dc: Z(86, 15, "Channel & division", "🔀", "Assigned to sales org."),
      sf: Z(86, 50, "Sales office", "🏪", "Assigned to sales area."),
      sp: Z(86, 85, "Shipping point", "🚚", "Assigned to plant."),
    },
    m: [
      [
        "co",
        "cc",
        "🔗",
        "Assign company to company code.",
        "Company → company code",
      ],
      [
        "pl",
        "cc",
        "🔗",
        "Assign plant to company code.",
        "Plant → company code",
      ],
      [
        "so",
        "cc",
        "🔗",
        "Assign sales org to company code.",
        "Sales org → company code",
      ],
      [
        "dc",
        "so",
        "🔗",
        "Assign distribution channel and division to sales org.",
        "Channel/division → sales org",
      ],
      [
        "sf",
        "so",
        "🔗",
        "Assign sales office to the sales area.",
        "Sales office → sales area",
      ],
      [
        "sp",
        "pl",
        "🔗",
        "Assign shipping point to plant (search the plant).",
        "Shipping point → plant",
      ],
    ],
  },
  {
    g: "2. Master data",
    t: "Prepare plant for materials",
    tc: "OMX1, OMX2, OMX3, CKMSTART, SM37",
    d: "Before the first material, your notes run these checks so the plant is ready for valuation. Follow the exact screens your trainer shows.",
    f: [
      "OMX1 / OMX2 / OMX3: check and save, plant 6000 should show green",
      "CKMSTART: remove the Test Run tick, execute, start immediately, confirm",
      "SM37: select the job, execute, status Finished",
    ],
    z: {
      u: Z(12, 50, "You", "🧑‍💻", "The person configuring."),
      pl: Z(50, 50, "Plant " + C, "🏭", "Needs valuation set up."),
      ok: Z(88, 50, "Ready", "✅", "Job finished, plant is ready."),
    },
    m: [
      [
        "u",
        "pl",
        "⚙️",
        "OMX1, OMX2, OMX3: check settings and save.",
        "Plant checks done",
      ],
      [
        "u",
        "pl",
        "▶️",
        "CKMSTART: untick Test Run, execute, start immediately.",
        "CKMSTART job scheduled",
      ],
      ["pl", "ok", "✅", "SM37: job status Finished.", "Job Finished"],
    ],
  },
  {
    g: "2. Master data",
    t: "Create material master",
    tc: "MM01",
    d: "The material master is the product record. Your example material is BMW Spare Parts, material type ROH as in your notes.",
    f: [
      "Description: BMW Spare Parts. Industry M Mechanical, type ROH. Plant " +
        C +
        ", sales org " +
        C +
        ", distribution channel 01, storage location 1000",
      "Basic data 1: unit kg, material group 000, gross and net weight 1",
      "Sales org 1 and 2: item category NORM; Sales/plant: transportation group 0001, loading group 0001",
      "Purchasing: purchasing group 001, purchase value 1, GR processing time 1",
      "MRP 1: MRP type VB, reorder point 1000, planning time 1, lot size TB, min 10, max 1000",
      "Accounting 1: valuation class 3000, standard price 1, per unit 1",
      "Standard HU type E1 (for EWM). Save, note the material number",
    ],
    z: {
      u: Z(12, 50, "You (MM01)", "🧑‍💻", "Creates the material."),
      mat: Z(48, 50, "BMW Spare Parts", "🔧", "Material master record."),
      pl: Z(86, 22, "Plant " + C, "🏭", "Plant views."),
      sl: Z(86, 78, "SLoc 1000", "🗄️", "Storage view."),
    },
    m: [
      [
        "u",
        "mat",
        "✍️",
        "Fill the views one by one: basic, sales, purchasing, MRP, plant, accounting.",
        "Material master created",
      ],
      ["mat", "pl", "🔗", "Plant data saved.", "Material in plant " + C],
      [
        "mat",
        "sl",
        "🔗",
        "Storage location 1000 saved.",
        "Material in SLoc 1000",
      ],
    ],
  },
  {
    g: "2. Master data",
    t: "Business partner: vendor",
    tc: "BP, roles FLVN01 and FLVN00",
    d: "A vendor is a business partner. First the general part, then the purchasing role, then the company code role.",
    f: [
      "Organization, grouping 0002, title 0003, name BMWIVend, search term BMWI",
      "Address: street, 12345 New York, US, region NY, language English. Save",
      "Switch to role FLVN01 Purchasing: purch. org " +
        C +
        ", currency INR, payment terms 0001, purchasing group 001, planned delivery time 1",
      "General data → Vendor general data: external vendor no.",
      "Switch to FLVN00: company code " +
        C +
        ", Adopt, reconciliation account 2130199 (vendors payable). Save",
    ],
    z: {
      bp: Z(14, 50, "BP BMWIVend", "👤", "The business partner."),
      pu: Z(60, 18, "FLVN01 purchasing", "🧾", "Purchasing org data."),
      co: Z(
        60,
        50,
        "FLVN00 company code",
        "🏛️",
        "Finance data, recon. account 2130199.",
      ),
      ve: Z(88, 82, "Vendor ready", "✅", "Can be used in a PO."),
    },
    m: [
      [
        "bp",
        "bp",
        "📝",
        "Create BP organization with name and address, save.",
        "BP BMWIVend created",
      ],
      [
        "bp",
        "pu",
        "➕",
        "Add role FLVN01: purchasing org, INR, group 001.",
        "Vendor purchasing data",
      ],
      [
        "bp",
        "co",
        "➕",
        "Add role FLVN00: company code, Adopt, recon. 2130199.",
        "Vendor company code data",
      ],
      ["co", "ve", "✅", "Save. The vendor can now be used.", "Vendor ready"],
    ],
  },
  {
    g: "2. Master data",
    t: "Business partner: customer",
    tc: "BP, roles FLCU01 and FLCU00",
    d: "A customer is also a business partner. Sales data goes in FLCU01, company code data in FLCU00.",
    f: [
      "BP BMWICust, grouping 0002, title 0003, search term BMWI, language English. Save",
      "Switch to FLCU01: sales org " +
        C +
        ", distribution channel 01, division 01, price group 01, customer pricing procedure 1",
      "General data → Customer general data: external customer no., tax data",
      "Switch to FLCU00: company code " +
        C +
        ", Adopt, reconciliation account 114100. Save",
    ],
    z: {
      bp: Z(14, 50, "BP BMWICust", "👤", "The business partner."),
      sd: Z(60, 18, "FLCU01 sales", "💼", "Sales area data."),
      co: Z(
        60,
        50,
        "FLCU00 company code",
        "🏛️",
        "Finance data, recon. account 114100.",
      ),
      cu: Z(88, 82, "Customer ready", "✅", "Can be used in a sales order."),
    },
    m: [
      [
        "bp",
        "bp",
        "📝",
        "Create BP BMWICust with address, save.",
        "BP BMWICust created",
      ],
      [
        "bp",
        "sd",
        "➕",
        "Add role FLCU01: sales org, channel 01, division 01.",
        "Customer sales data",
      ],
      [
        "bp",
        "co",
        "➕",
        "Add role FLCU00: company code, Adopt, recon. 114100.",
        "Customer company code data",
      ],
      ["co", "cu", "✅", "Save. The customer is ready.", "Customer ready"],
    ],
  },
  {
    g: "3. Procurement (SLoc 1000)",
    t: "Purchase order and goods receipt in SLoc 1000",
    tc: "ME21N, MIGO, OB72, OBB5, MMBE",
    d: "Order from BMWIVend, then post the goods receipt. The PO does not add stock; only the goods receipt does. If MIGO complains about a global company code, create and assign it (OB72, OBB5).",
    f: [
      "ME21N: supplier BMWIVend, purch. org " +
        C +
        ", group 001, company code " +
        C,
      "Item: material, quantity, plant " + C + ", storage location 1000",
      "Conditions: PBXX, amount 10. Save",
      "If error: OB72 create global company code, OBB5 assign it to the SAP company code",
      "MIGO: Goods receipt, purchase order, enter PO number, tick item OK, Post",
      "Display document, then document info → FI document",
    ],
    m: [
      [
        "erp",
        "vendor",
        "📨",
        "ME21N: PO to BMWIVend, plant " + C + ", SLoc 1000, PBXX price 10.",
        "PO created (100 pcs, SLoc 1000)",
        { po: 100 },
      ],
      [
        "vendor",
        "door_in",
        "🚛",
        "Vendor delivers the goods.",
        "Goods arrived",
      ],
      [
        "door_in",
        "erp",
        "📥",
        "MIGO: Goods Receipt → Purchase Order → item OK → Post.",
        "GR 101 posted: +100 in SLoc 1000 (plant " + C + ")",
        { s1000: 100, po: -100 },
      ],
      [
        "erp",
        "erp",
        "📒",
        "Document info → FI document: accounting posting is created.",
        "FI document created",
      ],
    ],
  },
  {
    g: "4. Extend to storage locations",
    t: "Extend material to storage locations 5000 and 6000",
    tc: "MM01",
    d: "Same material and same plant, new storage locations. Enter the existing material number and add storage data.",
    f: [
      "Material number (existing), industry M, type ROH, continue",
      "Plant " +
        C +
        ", storage location 5000, sales org " +
        C +
        ", distribution channel 01. Enter and save",
      "Repeat the same for storage location 6000",
    ],
    z: {
      m1: Z(14, 50, "BMW Spare Parts (SLoc 1000)", "🔧", "Existing material."),
      p5: Z(74, 22, "SLoc 5000", "🗄️", "EWM-managed storage location."),
      p6: Z(74, 78, "SLoc 6000", "🗄️", "Second storage location."),
    },
    m: [
      [
        "m1",
        "p5",
        "➕",
        "Extend to storage location 5000 and save.",
        "Material extended to SLoc 5000",
      ],
      [
        "m1",
        "p6",
        "➕",
        "Extend to storage location 6000 and save.",
        "Material extended to SLoc 6000",
      ],
    ],
  },
  {
    g: "4. Extend to storage locations",
    t: "Business partner for PED and supply chain unit",
    tc: "BP, then SCM Extended Warehouse Management → Master Data",
    d: "PED is a vendor-type partner used for the warehouse. The supply chain unit (SCU) represents the warehouse site in EWM.",
    f: [
      "BP BMWIPED, grouping 0002, title 0003, search term BMWI, address Sesame Street, 12345 New York, US, region NY, English",
      "FLVN01: purch. org " +
        C +
        ", currency USD, planned delivery 001, payment 0001, planned time 1; external vendor BMWIPED; plant " +
        C,
      "FLVN00: company code " +
        C +
        ", Adopt, reconciliation account 2130200 (vendors payable domestic)",
      "SAP menu → Logistics → SCM Extended WM → Master data → Maintain supply chain unit",
      "SCU " +
        "BMWISCU, type 1001, description, title company, search term, address, English; tick the door/gate option; check general data has longitude/latitude; Save",
    ],
    z: {
      ped: Z(14, 25, "BP BMWIPED", "👤", "Partner for the warehouse."),
      scu: Z(60, 50, "Supply chain unit", "🏬", "Site in EWM."),
      wh: Z(88, 80, "Warehouse", "🏢", "Later linked to this SCU."),
    },
    m: [
      [
        "ped",
        "ped",
        "📝",
        "Create BP BMWIPED, vendor roles FLVN01 and FLVN00.",
        "BP BMWIPED created",
      ],
      [
        "ped",
        "scu",
        "➕",
        "Create supply chain unit BMWISCU, type 1001, with address.",
        "Supply chain unit created",
      ],
      [
        "scu",
        "wh",
        "🔗",
        "SCU is later assigned to the warehouse number.",
        "SCU ready for warehouse",
      ],
    ],
  },
  {
    g: "5. Connect ERP and EWM",
    t: "ERP side: distribution model and shipping",
    tc: "SPRO → Logistics Execution → Extended WM → Basic setup for connectivity; BD64",
    d: "This step lets ERP send deliveries to EWM. The distribution model tells SAP which warehouse gets which documents.",
    f: [
      "Configure SAP EWM: check the warehouse number is EWM, not local",
      "General distribution model: warehouse number " +
        C +
        ", logical system for EWM, run the LHA model, all OK",
      "BD64 → LHA model → logical system for the EWM client → add Inbound delivery and Delivery change → receiver determination → filter on warehouse number",
      "Basic setup → Shipping → Configure global shipping: shipping point and goods receipt point",
      "Assign shipping point: copy the 5000 and 6000 entries; change NMEG to " +
        C,
    ],
    z: {
      erp: Z(14, 50, "ERP", "🖥️", "Sends deliveries."),
      dm: Z(
        50,
        50,
        "Distribution model",
        "🗺️",
        "BD64: who gets which document.",
      ),
      ewm: Z(86, 50, "EWM", "🧠", "Receives deliveries."),
    },
    m: [
      [
        "erp",
        "dm",
        "⚙️",
        "Configure EWM, check warehouse number, create model.",
        "Distribution model created",
      ],
      [
        "dm",
        "dm",
        "🔎",
        "BD64: add inbound delivery and delivery change, filter on warehouse.",
        "Receiver determination set",
      ],
      [
        "dm",
        "ewm",
        "🔄",
        "Distribute the model so EWM is connected.",
        "ERP ↔ EWM connected",
      ],
      [
        "erp",
        "erp",
        "🚚",
        "Assign shipping points (5000 and 6000 entries).",
        "Shipping points assigned",
      ],
    ],
  },
  {
    g: "5. Connect ERP and EWM",
    t: "EWM side: warehouse settings",
    tc: "SPRO → SCM Extended Warehouse Management",
    d: "Now set up the warehouse inside EWM: copy the sample warehouse, assign it to the SCU, and map ERP storage locations.",
    f: [
      "Cross-process settings: copy warehouse number from NMEG",
      "Master data: check warehouse no. is defined; Assign → " +
        C +
        " → supply chain unit → BMWISCU",
      "Define number ranges: copy all from NMEG",
      "Interfaces → ERP integration → General: assign warehouse number from Logistics Execution; select the LHA client, copy and change ERP/EWM",
      "General settings: copy NMEG for 5000, 6000",
      "Goods movement: map storage locations, copy NMEG for 5000, 6000",
    ],
    z: {
      nm: NM,
      wh: Z(50, 20, "Warehouse " + C, "🏬", "EWM warehouse."),
      scu: Z(50, 80, "Supply chain unit", "🏢", "BMWISCU."),
      map: Z(
        86,
        50,
        "Plant / SLoc mapping",
        "🔗",
        "Links ERP storage locations to the EWM warehouse.",
      ),
    },
    m: [
      [
        "nm",
        "wh",
        "📋",
        "Copy warehouse number from NMEG.",
        "EWM warehouse copied",
      ],
      [
        "scu",
        "wh",
        "🔗",
        "Assign the supply chain unit to the warehouse.",
        "SCU → warehouse",
      ],
      [
        "wh",
        "wh",
        "🔢",
        "Copy number ranges from NMEG.",
        "Number ranges copied",
      ],
      [
        "wh",
        "map",
        "🔗",
        "ERP integration: assign warehouse, map storage locations 5000 and 6000.",
        "Storage locations mapped",
      ],
    ],
  },
  {
    g: "5. Connect ERP and EWM",
    t: "Create storage bins",
    tc: "SAP Menu → Logistics → SCM Extended WM → Extended WM → Master Data → Storage Bin",
    d: "Create three places: a GR zone for receiving, a bin for storage, and a GI zone for shipping.",
    f: [
      "Warehouse number " +
        C +
        "; Storage bin GR-ZONE, storage type 9010. Save",
      "Storage bin BIN-1 (0010), storage type 0010. Save",
      "Storage bin GI-ZONE, storage type 9020. Save",
    ],
    m: [
      [
        "ewm",
        "gr",
        "🟨",
        "Create bin GR-ZONE, storage type 9010.",
        "Bin GR-ZONE created",
      ],
      [
        "ewm",
        "bins",
        "🗄️",
        "Create bin BIN-1, storage type 0010.",
        "Bin BIN-1 created",
      ],
      [
        "ewm",
        "door_out",
        "🟦",
        "Create bin GI-ZONE, storage type 9020.",
        "Bin GI-ZONE created",
      ],
    ],
  },
  {
    g: "6. Inbound (SLoc 5000)",
    t: "Purchase order for storage location 5000",
    tc: "ME21N, MMBE",
    d: "Same as before, but the storage location is 5000, which is managed by EWM. A PO does not add stock, it only creates an open order quantity.",
    f: [
      "Supplier BMWIVend, purch. org " + C + ", group 001, company code " + C,
      "Material, quantity, plant, storage location 5000, confirmation control 0004",
      "Save, then MMBE to view stock by storage location",
    ],
    m: [
      [
        "erp",
        "vendor",
        "📨",
        "ME21N: PO for plant " + C + ", SLoc 5000, 100 pcs.",
        "PO created (100 pcs, SLoc 5000)",
        { po: 100 },
      ],
    ],
  },
  {
    g: "6. Inbound (SLoc 5000)",
    t: "Inbound delivery",
    tc: "VL31N, SMQ2",
    d: "Create the inbound delivery with the PO number. It travels to EWM through a queue, so check SMQ2 for errors. It does not add stock; stock is added only at goods receipt.",
    f: [
      "VL31N: enter vendor and purchase order number",
      "Check data and Save",
      "SMQ2: check there are no errors in the queue",
    ],
    m: [
      [
        "vendor",
        "erp",
        "📄",
        "VL31N: enter PO number, check data, save.",
        "Inbound delivery created (ERP)",
        { ibd: 100 },
      ],
      [
        "erp",
        "ewm",
        "🔄",
        "Replicated to EWM through the queue. Check SMQ2.",
        "Inbound delivery in EWM",
      ],
    ],
  },
  {
    g: "6. Inbound (SLoc 5000)",
    t: "Unload, goods receipt and putaway",
    tc: "Warehouse Management Monitor",
    d: "In the monitor, open the inbound delivery, unload, post goods receipt, then create and confirm the putaway task.",
    f: [
      "SAP Menu → Logistics → SCM Extended WM → Monitoring → Warehouse Management Monitor; node " +
        C +
        ", monitor SAP, Execute",
      "Inbound → Documents → Inbound Delivery → Inbound Delivery Item. Direct execute: Yes",
      "Click the doc number, Refresh, then Unload, then Goods Receipt",
      "Follow-on: Warehouse Task (check, create), then Display Warehouse Task → Warehouse Order → Confirm and Save",
      "Refresh: putaway status Completed. MMBE: stock in 5000",
    ],
    m: [
      ["vendor", "door_in", "🚛", "Truck arrives.", "Truck checked in"],
      [
        "door_in",
        "gr",
        "📦",
        "Monitor: click Unload.",
        "Unloaded at the door (no stock posted yet)",
      ],
      [
        "gr",
        "erp",
        "📄",
        "Monitor: click Goods Receipt. Stock is now posted in EWM (GR zone) and in ERP (SLoc 5000).",
        "GR posted: +100 in SLoc 5000",
        { s5000: 100, po: -100, ibd: -100, gr: 100 },
      ],
      [
        "ewm",
        "bins",
        "📝",
        "Follow-on: create warehouse task GR zone → bin.",
        "Putaway warehouse task created",
      ],
      [
        "gr",
        "bins",
        "🚜",
        "Warehouse order: Confirm and Save. Putaway Completed.",
        "Putaway confirmed",
        { gr: -100, bin: 100 },
      ],
    ],
  },
  {
    g: "7. Outbound",
    t: "Sales order",
    tc: "VA01",
    d: "Order type OR. Enter the customer and material, then check the schedule lines.",
    f: [
      "Order type OR, sales org " + C + ", distribution channel 01",
      "Sold-to and Ship-to: BMWICust; payment terms 0001; incoterms 0001; customer reference ABCDEF",
      "Material, order quantity, plant " + C + ", storage location 5000",
      "Check dates in Schedule Lines. If asked for profit center or company code, enter it and continue. Save",
    ],
    m: [
      [
        "customer",
        "erp",
        "🛒",
        "VA01: OR order, sold-to BMWICust, 40 pcs.",
        "Sales order created (40 pcs)",
        { so: 40 },
      ],
      [
        "erp",
        "erp",
        "🔎",
        "Check schedule lines and availability.",
        "Schedule lines confirmed",
      ],
    ],
  },
  {
    g: "7. Outbound",
    t: "Outbound delivery",
    tc: "VL01N, SMQ2, MMBE",
    d: "Create the delivery from the sales order with the shipping point. It then goes to EWM.",
    f: [
      "VL01N: shipping point " + C + ", sales order number, Continue",
      "Check data and Save",
      "Check SMQ2 for errors and MMBE for stock",
    ],
    m: [
      [
        "erp",
        "erp",
        "🚚",
        "VL01N: shipping point, order number, save.",
        "Outbound delivery created (ERP)",
        { so: -40, dlv: 40 },
      ],
      [
        "erp",
        "ewm",
        "🔄",
        "Replicated to EWM as outbound delivery order.",
        "EWM outbound delivery order",
      ],
    ],
  },
  {
    g: "7. Outbound",
    t: "Picking and goods issue in the monitor",
    tc: "Warehouse Management Monitor",
    d: "Create the picking task, confirm it so goods reach the GI zone, then post the goods issue.",
    f: [
      "Monitor → Outbound → Documents → Outbound Orders → Outbound Item; Refresh, select document",
      "Top left: Outbound delivery order → Follow-on → Warehouse Task → Create and Save",
      "Back, Display Warehouse Tasks → Warehouse Order → Confirm and Save; destination is the GI zone",
      "Back, Refresh: picking Completed, then Goods Issue Completed",
      "SMQ2: check errors. MMBE: check storage",
    ],
    m: [
      [
        "ewm",
        "bins",
        "📝",
        "Create and save the picking warehouse task.",
        "Picking warehouse task created",
      ],
      [
        "bins",
        "door_out",
        "🖐️",
        "Confirm warehouse order. Goods move bin → GI zone. Picking Completed.",
        "Picking completed",
        { bin: -40, gi: 40 },
      ],
      [
        "door_out",
        "erp",
        "📄",
        "Goods Issue Completed. ERP stock reduces.",
        "GI posted: -40 in SLoc 5000",
        { s5000: -40, gi: -40, dlv: -40, cust: 40 },
      ],
      [
        "door_out",
        "customer",
        "🚚",
        "Goods leave for the customer. Check SMQ2 and MMBE.",
        "Delivered to customer",
      ],
    ],
  },
];
