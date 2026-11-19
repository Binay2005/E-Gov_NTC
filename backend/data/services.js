
const services = [

    // EXTERNAL NTC SERVICES

    {
        name: "NTTV",
        description: "Explore Nepal Telecom television services and packages.",
        category: "NTC Service",
        type: "redirect",
        icon: "📺",
        actionValue: "https://www.ntc.net.np/services/nttv",
        actionLabel: "Explore Service",
        sortOrder: 1
    },
    {
        name: "International Roaming",
        description: "Use your Nepal Telecom number while travelling abroad.",
        category: "NTC Service",
        type: "redirect",
        icon: "🌍",
        actionValue: "https://www.ntc.net.np/services/international-roaming",
        actionLabel: "Explore Service",
        sortOrder: 2
    },
    {
        name: "FTTH",
        description: "Explore fiber internet, voice and television services.",
        category: "NTC Service",
        type: "redirect",
        icon: "🌐",
        actionValue: "https://www.ntc.net.np/services/fiber-to-the-home-ftth",
        actionLabel: "Explore Service",
        sortOrder: 3
    },
    {
        name: "ADSL",
        description: "Explore Nepal Telecom ADSL broadband services.",
        category: "NTC Service",
        type: "redirect",
        icon: "🛜",
        actionValue: "https://www.ntc.net.np/services/adsl-service",
        actionLabel: "Explore Service",
        sortOrder: 4
    },
    {
        name: "GSM Prepaid Service",
        description: "Information about Namaste prepaid mobile services.",
        category: "NTC Service",
        type: "redirect",
        icon: "📱",
        actionValue: "https://www.ntc.net.np/services/gsm-prepaid-service",
        actionLabel: "Explore Service",
        sortOrder: 5
    },
    {
        name: "GSM Postpaid Service",
        description: "Explore Nepal Telecom postpaid mobile services.",
        category: "NTC Service",
        type: "redirect",
        icon: "📞",
        actionValue: "https://www.ntc.net.np/services/gsm-postpaid-service",
        actionLabel: "Explore Service",
        sortOrder: 6
    },
    {
        name: "eSIM",
        description: "Get a new eSIM or convert your physical SIM to eSIM.",
        category: "NTC Service",
        type: "redirect",
        icon: "📲",
        actionValue: "https://esim.ntc.net.np/",
        actionLabel: "Visit eSIM Portal",
        sortOrder: 7
    },

    // UTILITIES

    {
        name: "Balance Inquiry",
        description: "Check your current prepaid mobile balance.",
        category: "Utility",
        type: "ussd",
        icon: "💰",
        actionValue: "*400#",
        actionLabel: "Check Balance",
        sortOrder: 1
    },
    {
        name: "Purchase Data",
        description: "Browse and purchase Nepal Telecom data packages.",
        category: "Utility",
        type: "redirect",
        icon: "📶",
        actionValue: "https://offer.ntc.net.np/",
        actionLabel: "Buy Data",
        sortOrder: 2
    },
    {
        name: "Enable 4G",
        description: "Check compatibility and activate 4G/LTE service.",
        category: "Utility",
        type: "ussd",
        icon: "🚀",
        actionValue: "*444#",
        actionLabel: "Activate 4G",
        sortOrder: 3
    },
    {
        name: "Recharge",
        description: "Recharge your Nepal Telecom mobile number online.",
        category: "Utility",
        type: "redirect",
        icon: "💳",
        actionValue: "https://cardpay.ntc.net.np/",
        actionLabel: "Recharge Now",
        sortOrder: 4
    },
    {
        name: "Balance Transfer",
        description: "Transfer prepaid balance to another Nepal Telecom number.",
        category: "Utility",
        type: "instruction",
        icon: "🔄",
        actionValue: "*422*SecurityCode*MobileNumber*Amount#",
        actionLabel: "View Instructions",
        sortOrder: 5
    },
    {
        name: "Special Inquiry",
        description: "Quick access to important emergency contact numbers.",
        category: "Utility",
        type: "emergency",
        icon: "🚨",
        actionValue: "emergency",
        actionLabel: "View Contacts",
        sortOrder: 6
    },
    {
        name: "Mobile Number",
        description: "Find the mobile number associated with your SIM.",
        category: "Utility",
        type: "ussd",
        icon: "📱",
        actionValue: "*9#",
        actionLabel: "Check Number",
        sortOrder: 7
    },
    {
        name: "SIM Owner",
        description: "Check the registered owner information of your SIM.",
        category: "Utility",
        type: "ussd",
        icon: "🪪",
        actionValue: "*922#",
        actionLabel: "Check SIM Owner",
        sortOrder: 8
    }
];

export default services;
