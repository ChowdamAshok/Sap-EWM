// Replaces the first 3 steps: no "copy from NMEG", you create everything directly.
// Load this AFTER steps.js and BEFORE script.js.
(function () {
  const g = "1. Enterprise structure (SPRO)";
  STEPS.splice(
    0,
    3,
    {
      g,
      t: "Define company and company code",
      tc: "SPRO → SAP Reference IMG → Enterprise Structure → Definition → Financial Accounting",
      d: "Start in customizing. Create the company with its display name, then its company code.",
      f: [
        "Define Company: company " +
          C +
          ", name BMW India Company, short description",
        "Address: street, postal 12345, New York, country US, region NY, leave time zone",
        "Save and enter the workbench request",
        "Define company code: " + C + ", name BMW India Company",
      ],
      z: {
        spro: Z(
          10,
          50,
          "SPRO",
          "⚙️",
          "Customizing screen where all configuration is done.",
        ),
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
          "co",
          "✍️",
          "Define Company: enter " +
            C +
            " and the display name BMW India Company, save with a request.",
          "Company " + C + " created",
        ],
        [
          "spro",
          "cc",
          "✍️",
          "Define company code " + C + " for BMW India Company.",
          "Company code " + C + " created",
        ],
      ],
    },
    {
      g,
      t: "Plant, sales organization, channel, office, group",
      tc: "Enterprise Structure → Definition → Logistics General / Sales and Distribution",
      d: "Define your plant and your sales structure, one object at a time.",
      f: [
        "Logistics General: define plant " +
          C +
          " and check it in Define Plant",
        "Sales org " + C + ", distribution channel 01 and division 01",
        "Sales office and sales group: define and save",
      ],
      z: {
        spro: Z(12, 50, "SPRO", "⚙️", "Customizing screen."),
        pl: Z(
          76,
          12,
          "Plant " + C,
          "🏭",
          "Location that makes or stores goods.",
        ),
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
          "spro",
          "pl",
          "✍️",
          "Define plant " + C + " and check it under Define Plant.",
          "Plant " + C + " defined",
        ],
        [
          "spro",
          "so",
          "✍️",
          "Define sales organization " + C + ".",
          "Sales org " + C + " defined",
        ],
        [
          "spro",
          "dc",
          "✍️",
          "Define distribution channel 01 and division 01.",
          "Channel 01 / division 01 defined",
        ],
        [
          "spro",
          "sf",
          "✍️",
          "Define the sales office.",
          "Sales office defined",
        ],
        [
          "spro",
          "sg",
          "✍️",
          "Define the sales group and save.",
          "Sales group defined",
        ],
      ],
    },
    {
      g,
      t: "Storage locations, purchasing org, warehouse, shipping point",
      tc: "Material Management, Logistics Execution",
      d: "Create the stock and purchasing side: storage locations, a purchasing organization, a warehouse number and a shipping point.",
      f: [
        "Maintain storage locations 1000, 5000, 6000 for plant " + C,
        "Define purchasing organization: description, save",
        "Logistics Execution: define warehouse number " + C,
        "Define shipping point " + C,
      ],
      z: {
        spro: Z(12, 50, "SPRO", "⚙️", "Customizing screen."),
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
          "spro",
          "sl",
          "✅",
          "Maintain storage locations 1000, 5000, 6000.",
          "Storage locations defined",
        ],
        [
          "spro",
          "po",
          "✍️",
          "Define purchasing organization, description, save.",
          "Purchasing org created",
        ],
        [
          "spro",
          "wh",
          "✍️",
          "Define warehouse number " + C + ".",
          "Warehouse number " + C + " defined",
        ],
        [
          "spro",
          "sp",
          "✍️",
          "Define shipping point " + C + ".",
          "Shipping point " + C + " created",
        ],
      ],
    },
  );
})();

// Real-company names: vendor = Bosch Auto Parts (ships BMW spare parts), customer = Infinity Cars (BMW dealer).
(function () {
  const VEN = "Bosch Auto Parts",
    CUS = "Infinity Cars";
  const fix = (o) => {
    if (typeof o === "string")
      return o.replace(/BMWIVend/g, VEN).replace(/BMWICust/g, CUS);
    if (Array.isArray(o)) {
      o.forEach((v, i) => (o[i] = fix(v)));
      return o;
    }
    if (o && typeof o === "object") {
      for (const k in o) o[k] = fix(o[k]);
    }
    return o;
  };
  fix(STEPS);
  FLOOR.vendor.n = VEN;
  FLOOR.vendor.i =
    "German supplier that ships BMW spare parts (brake pads, filters, sensors) to your warehouse.";
  FLOOR.customer.n = CUS;
  FLOOR.customer.i = "BMW car dealership that buys the spare parts from you.";
})();
