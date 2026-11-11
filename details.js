// Extra lesson details per step (same order as STEPS): why, common errors, quiz [question, options, correct index]
const DETAILS = [
  {
    w: "The company code is the smallest unit with its own complete books. Every financial posting needs one, so everything else is built under it.",
    e: [
      "Saving without a workbench request: SAP asks for a request, create one and continue.",
      "Defining the company but forgetting to copy the company code: nothing can post.",
    ],
    q: [
      "Which unit has its own balance sheet?",
      ["Plant", "Company code", "Sales org"],
      1,
    ],
  },
  {
    w: "The plant is where goods are made, stored or planned. The sales organization is who sells. Both are the base for every later document.",
    e: [
      "Plant copied but not checked in Define Plant: it may not be saved.",
      "Sales group missing later: the sales office was not assigned to the sales area.",
    ],
    q: [
      "Which unit is responsible for selling and pricing?",
      ["Sales org", "Storage location", "Purchasing org"],
      0,
    ],
  },
  {
    w: "A storage location holds ERP stock inside a plant. The warehouse number is the top unit in EWM. The shipping point is where deliveries leave from.",
    e: [
      "Storage location 1000/5000/6000 missing in the plant: MIGO cannot post goods there.",
      "No shipping point: outbound delivery cannot be created.",
    ],
    q: [
      "Where is stock kept inside a plant in ERP?",
      ["Storage location", "Sales office", "Company"],
      0,
    ],
  },
  {
    w: "Objects you create are separate until you assign them. Assignments tell SAP which plant belongs to which company code and which sales org sells from which plant.",
    e: [
      "Sales org, channel and division not linked: the sales area is invalid and VA01 fails.",
      "Plant not assigned to the sales org / channel: the material cannot be sold from that plant.",
    ],
    q: [
      "A plant must be assigned to which unit?",
      ["Company code", "Customer", "Material"],
      0,
    ],
  },
  {
    w: "Before the first material, the plant must be ready for valuation. These checks and jobs switch that on.",
    e: [
      "CKMSTART left in Test Run: nothing is actually changed.",
      "SM37 job not yet Finished: refresh and wait before moving on.",
    ],
    q: [
      "In CKMSTART the Test Run tick should be:",
      ["Left on", "Removed", "Ignored"],
      1,
    ],
  },
  {
    w: "Every document (PO, delivery, order) points to a material. Each view feeds a different department, so a missing view causes errors later.",
    e: [
      "Sales view missing: VA01 says the material is not maintained for the sales org.",
      "Storage location not entered: there is no storage data, so MIGO cannot post.",
    ],
    q: [
      "Which material type does the notes' Potato use?",
      ["FERT", "ROH", "HAWA"],
      1,
    ],
  },
  {
    w: "A vendor is a business partner. FLVN01 holds purchasing data and FLVN00 holds company code and finance data. A PO needs both.",
    e: [
      "FLVN00 skipped: PO says the vendor is not maintained for the company code.",
      "Wrong reconciliation account: the posting goes to the wrong ledger account.",
    ],
    q: [
      "Which role holds the vendor's purchasing data?",
      ["FLVN00", "FLVN01", "FLCU01"],
      1,
    ],
  },
  {
    w: "A customer is also a business partner. FLCU01 holds sales data and FLCU00 holds company code data. A sales order needs both.",
    e: [
      "FLCU01 missing for the sales org: VA01 rejects the customer.",
      "Reconciliation account not set: billing cannot post.",
    ],
    q: [
      "Which role holds the customer's sales area data?",
      ["FLCU01", "FLVN01", "FLCU00"],
      0,
    ],
  },
  {
    w: "The PO is the order to the vendor. The goods receipt (movement 101) adds stock. This SLoc 1000 flow is plain ERP, with no EWM yet.",
    e: [
      "Global company code not assigned: use OB72 and OBB5, then post again.",
      "Item not ticked OK in MIGO: the document cannot be posted.",
    ],
    q: [
      "Which movement type posts a goods receipt against a PO?",
      ["101", "201", "601"],
      0,
    ],
  },
  {
    w: "One material can be extended to more storage locations (and plants). You extend it, you do not create a new number.",
    e: [
      "Storage location not entered during extension: no stock can be posted there.",
      "Sales org view skipped: the material cannot be sold.",
    ],
    q: [
      "How do you add storage location 5000 to an existing material?",
      ["Create a new material", "Extend it with MM01", "Delete and redo"],
      1,
    ],
  },
  {
    w: "The supply chain unit (SCU) represents the warehouse site in EWM. The PED partner is the vendor-type partner used for it.",
    e: [
      "SCU type not 1001: later assignment to the warehouse fails.",
      "Address or coordinates missing: SAP shows warnings, fix before saving.",
    ],
    q: ["Which SCU type do the notes use?", ["1001", "9010", "0010"], 0],
  },
  {
    w: "ERP must know that storage location 5000 is run by EWM and where to send its deliveries. The distribution model does this.",
    e: [
      "Warehouse set as local, not EWM: deliveries never reach EWM.",
      "Receiver filter missing in BD64: no delivery is sent to the warehouse.",
    ],
    q: [
      "Which tcode maintains the distribution model?",
      ["BD64", "MIGO", "VA01"],
      0,
    ],
  },
  {
    w: "EWM must know which ERP plants and storage locations belong to which warehouse so goods movements match.",
    e: [
      "Storage location not mapped: goods movement fails.",
      "Number ranges not copied: documents cannot be numbered.",
    ],
    q: [
      "What must be mapped between ERP and EWM for goods movements?",
      ["Storage locations", "Customers", "Company names"],
      0,
    ],
  },
  {
    w: "Tasks need places to move goods between. The GR zone receives, the bin stores, the GI zone ships.",
    e: [
      "Storage type missing: the bin cannot be created.",
      "Bin created in the wrong warehouse: tasks cannot find it.",
    ],
    q: [
      "Which storage type is the GR zone in the notes?",
      ["9010", "9020", "0010"],
      0,
    ],
  },
  {
    w: "This PO tells ERP that goods are coming into storage location 5000, which is managed by EWM and mapped to the warehouse.",
    e: [
      "SLoc 5000 not mapped: the delivery is not sent to EWM.",
      "Vendor missing FLVN00: PO cannot be saved.",
    ],
    q: [
      "Which tcode shows stock by storage location?",
      ["MMBE", "SMQ2", "BD64"],
      0,
    ],
  },
  {
    w: "The inbound delivery announces the goods. It reaches EWM through a queue, so you must check the queue.",
    e: [
      "Queue stuck in SMQ2: the delivery is not in EWM, retry or fix the error.",
      "Wrong PO number in VL31N: no items are proposed.",
    ],
    q: ["Which tcode shows queue errors?", ["SMQ2", "MMBE", "VL01N"], 0],
  },
  {
    w: "The putaway warehouse task tells the operator which bin to put the goods in. Confirming it moves stock from the GR zone to the bin.",
    e: [
      "Warehouse task not created: check the bin and storage type setup.",
      "Order not confirmed: stock stays in the GR zone.",
    ],
    q: [
      "What tells the operator where to put the goods?",
      ["Warehouse task", "Sales order", "Invoice"],
      0,
    ],
  },
  {
    w: "The sales order records what the customer wants and checks availability. It is the start of the outbound process.",
    e: [
      "Material not available in the plant: schedule lines show no confirmed quantity.",
      "Profit center or company code prompt: enter it and continue.",
    ],
    q: ["Which order type is used in the notes?", ["OR", "NB", "ZZ"], 0],
  },
  {
    w: "The outbound delivery tells the warehouse what to ship and creates the outbound delivery order in EWM.",
    e: [
      "Shipping point not assigned to the plant: VL01N fails.",
      "Queue error in SMQ2: the delivery does not reach EWM.",
    ],
    q: [
      "Which tcode creates the outbound delivery?",
      ["VL01N", "VL31N", "ME21N"],
      0,
    ],
  },
  {
    w: "The picking task moves goods from the bin to the GI zone. Goods issue then reduces ERP stock and finishes the delivery.",
    e: [
      "Warehouse order not confirmed: goods issue cannot be posted.",
      "Wrong bin quantity: the pick is short, check MMBE and the monitor.",
    ],
    q: [
      "Goods are picked from the bin into which zone?",
      ["GI zone", "GR zone", "Plant 1000"],
      0,
    ],
  },
];
