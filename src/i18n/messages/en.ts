const messages = {
  nav: {
    help: 'Help',
    register: 'Sign up',
    login: 'Sign in',
    logoAlt: 'Logo',
    profileAlt: 'Profile',
    toggleMenu: 'Toggle menu',
    menuTitle: 'Menu',
    closeMenu: 'Close menu',
    profile: 'Profile',
    logout: 'Logout'
  },
  home: {
    hero: {
      tagline: 'Delivery by people for people',
      title: 'Send wherever and however you want',
      subtitle: 'Cargix makes it possible',
      ctaSend: 'Send now',
      ctaFind: 'Find a ride'
    },
    how: {
      title: 'How does it work?',
      description: 'The whole process takes just minutes. We help you find a driver who is already going your route — you save money and time while transport is used more efficiently.',
      steps: [
        {
          title: 'Create a request',
          description: 'Describe the parcel (type, weight, approximate dimensions), specify the route and preferred date. Add a photo — drivers will respond faster.'
        },
        {
          title: 'Choose a driver',
          description: 'Browse driver profiles, their rating, previous reviews and offered price. Clarify details in the chat before confirming.'
        },
        {
          title: 'Handover and delivery',
          description: 'Meet at the agreed point or drop-off spot. Track status. After receiving — leave a review and rating.'
        }
      ]
    },
    eco: {
      title: 'We make delivery ecological and fast',
      paragraph: 'Our service connects those who want to send items with drivers already heading in the right direction. By using free trunk space, we cut empty kilometers, save your time and money, and reduce CO₂ emissions.',
      howTitle: 'How it works?',
      howParagraph: 'You leave a request with shipment details, we pick the nearest passing driver who takes your parcel on the way. Communicate with the driver in chat and leave a review after successful delivery.',
      fastDelivery: 'Fast delivery'
    },
    mission: {
      sectionTitle: 'Our mission',
      title: 'We make delivery humane, affordable and environmentally responsible',
      paragraph: 'We connect people whose route is already set with those who need to send something. This reduces empty kilometers, cuts costs and waiting time. Each trip becomes more useful: for sender, driver and the planet. Transparency, trust and mutual benefit are the foundation of our platform.',
      cards: {
        transparency: {
          title: 'Transparency',
          text: 'Profiles with ratings, delivery history and clear statuses build trust and remove uncertainty.'
        },
        economy: {
          title: 'Economy',
          text: 'Routes already exist — we simply use free space. Less cost for the sender, extra income for the driver.'
        },
        ecology: {
          title: 'Eco-friendliness',
          text: 'Optimized cargo space = fewer unnecessary trips and CO₂. Every shared delivery is a small step toward sustainability.'
        }
      },
      aboutButton: 'about us'
    },
    gallery: {
      title: 'Do it quickly, conveniently, profitably',
      subtitle: 'Brief moments of interaction: requests, movement, handover and receipt. Everything is compact - just like our approach to delivery.',
      images: [
        { alt: 'Package handover' },
        { alt: 'Driver on the road' },
        { alt: 'Compact packaging' },
        { alt: 'Path cushioning' },
        { alt: 'Route on the map' },
        { alt: 'Receiving the shipment' }
      ]
    },
    earn: {
      title: 'Earn with Cargix',
      subtitle: 'Plan routes with maximum comfort and without extra effort. Our platform allows you to quickly find optimal routes and save time on the road. Use the application for convenient communication with senders and transparent payments without unnecessary paperwork.',
      driver: {
        title: 'Benefits for the driver',
        subtitle: 'Choose trips according to your schedule and earn income from each delivery. The intuitive interface allows you to quickly add routes and accept orders without unnecessary calls. Automatic notifications keep you informed of new requests and execution status.',
        button: 'Learn more'
      },
      sender: {
        title: 'Benefits for the sender',
        subtitle: 'Find verified drivers for fast and reliable delivery in a few clicks. Flexible tariffs and driver ratings guarantee an optimal price-quality ratio. All communications, confirmations and payments take place in the application - without unnecessary bureaucracy.',
        button: 'Learn more'
      }
    },
    calculate: {
      sectionTitle: 'Quick calculation',
      title: 'Calculate delivery in a few seconds',
      subtitle: 'Specify where from and where to, approximate weight and dimensions. We will select passing routes, predict the cost range and suggest how to optimize: change the date, transfer point or combine with an existing request.',
      cards: {
        route: {
          title: 'Route',
          text: 'The start and end points determine the distance and available passing drivers.'
        },
        volume: {
          title: 'Volume & weight',
          text: 'Understanding the occupied space allows for optimal use of the trunk.'
        },
        optimization: {
          title: 'Optimization',
          text: 'The algorithm advises how to reduce the cost: a flexible date or an alternative transfer.'
        }
      },
      mapTitle: 'Indicate points on the map',
      inputs: {
        title: 'Input data',
        weight: 'Weight (kg)',
        weightPlaceholder: 'E.g. 4.5',
        dims: 'Dimensions (cm)',
        dimsPlaceholder: 'L×W×H',
        transferType: 'Transfer type',
        transferTypePlaceholder: 'Personal / Point',
        button: 'Calculate'
      },
      estimate: {
        title: 'Estimate',
        distance: 'Predicted distance',
        fill: 'Trunk fill',
        cost: 'Cost range',
        time: 'Time on the road',
        suggestionDefault: 'An optimization tip will appear after calculation.'
      }
    },
    news: {
      title: 'News and updates',
      subtitle: 'Here you will find the latest news, service updates and useful delivery tips. Follow the changes to be aware of new opportunities and promotions on the Cargix platform.',
      button: 'View all news',
      newsTag: 'News',
      // ...
      viewMore: 'View more'
    }
  },
  about: {
    title: "We're changing the way things move",
    subtitle: "Cargix is a platform that turns trips that are already happening into an opportunity to send things faster, cheaper, and with less environmental impact. We connect people and make delivery more humane and intelligent.",
    stats: [
      { value: "18 tons", label: "CO₂ saved" },
      { value: "30%", label: "Cheaper than market" },
      { value: "24/7", label: "Support" },
      { value: "4.8/5", label: "User rating" }
    ],
    pillarsTitle: "Our Pillars",
    pillars: [
      { title: "Humanity", text: "Live dialogue, mutual respect, and a community of people helping people. We're moving away from faceless services." },
      { title: "Efficiency", text: "Using already planned trips and free space in transport. Less empty kilometers, more benefit." },
      { title: "Trust", text: "Profiles, delivery history, reviews, and verification. We build a transparent and secure environment." },
      { title: "Eco-friendliness", text: "Every shared delivery is a reduction in CO₂ emissions. We make logistics greener." }
    ],
    howWeWorkTitle: "How We Work",
    howWeWorkSubtitle: "Our system is designed to be simple, intuitive, and effective for both senders and drivers. We automate routine tasks so you can focus on what's important.",
    howWeWorkSteps: [
      { title: "Intelligent Matching", text: "The algorithm connects senders with drivers whose routes coincide, taking into account the time, size of the shipment, and rating." },
      { title: "Secure Communication", text: "An internal chat for discussing details with protection against spam and phishing. All correspondence is saved." },
      { title: "Transparent Pricing", text: "The system suggests a fair price range based on distance, volume, and market demand, avoiding dumping or overpricing." }
    ],
    safetyTitle: "Safety and Trust",
    safetySubtitle: "We have implemented a multi-level system to ensure the security of each delivery and the reliability of all participants.",
    policyButton: "Read the Policy",
    safetyItems: [
      { head: "Multi-level Verification", body: "Email, phone, documents, and voluntary car confirmation. The system analyzes behavior patterns and reacts before complaints arise." },
      { head: "Trust Rating", body: "An algorithmic weighting of recent ratings and trust signals helps in choosing a verified driver." },
      { head: "Protected Chat", body: "Automatic hiding of suspicious links and phishing templates to protect users." },
      { head: "Partial Insurance", body: "We are preparing a model of partial insurance coverage and optional surcharges for valuable shipments." }
    ],
    developersTitle: "For Developers",
    developersSubtitle: "We are open to integration and believe that collaboration can make logistics even smarter. Our API provides tools for partnership solutions.",
    developers: [
      { title: "Open API", text: "Integrate Cargix with your services: online stores, warehouse systems, corporate portals." },
      { title: "Webhooks", text: "Get real-time notifications about delivery status changes to automate your business processes." },
      { title: "Partner Program", text: "Monetize your audience by offering them a modern delivery solution. We provide widgets, referral links, and support." },
      { title: "Documentation", text: "Detailed descriptions of all API endpoints, examples, and a sandbox for testing. We help you get started quickly." }
    ]
  },
  signin: {
    welcome: "Welcome to Cargix",
    emailLabel: "E-mail",
    passwordLabel: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    loginButton: "Login",
    loginWith: "Login with:",
    noAccount: "Don't have an account?",
    createAccount: "Create an account",
    error: "Invalid email or password"
  },
  signup: {
    stage1: {
      title: "Create your Cargix account",
      subtitle: "Enter your email address to continue.",
      continueButton: "Continue",
      hasAccount: "Have an account?",
      login: "Login"
    },
    stage2: {
      title: "Set a password",
      subtitle: "Enter a password for your account.",
      passwordLabel: "Password",
      passwordHint: "Password must be at least 8 characters long, including upper and lower case letters, numbers and special characters.",
      passwordError: "Password must be at least 8 characters long, including upper and lower case letters, numbers and special characters.",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordError: "Passwords must match.",
      continueButton: "Continue"
    },
    stage3: {
      title: "Last step",
      subtitle: "Enter the specified information.",
      firstNameLabel: "First name",
      lastNameLabel: "Last name",
      birthDateLabel: "Date of birth",
      phoneNumberLabel: "Phone number",
      continueButton: "Continue"
    },
    stage4: {
      title: "One last step",
      subtitle: "Your account has been successfully created. To complete the registration process, please go to the specified email and confirm your registration.",
      mainButton: "Home"
    },
    emailLabel: "E-mail"
  },
  policy: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: {date}",
    subtitle: "This document explains what data we collect, for what purpose we process it, and what rights the user has. The goal is transparency, security, and compliance with current Ukrainian legislation and data protection principles (GDPR — if applicable).",
    general: {
        title: "1. General Provisions",
        p1: "{companyName} (hereinafter – 'Service', 'we') is the owner and administrator of an online platform for publishing and accepting delivery requests, and for interaction between senders and carriers/drivers.",
        p2: "The purpose of this Policy is to inform users about the principles of collection, storage, use, and protection of personal data, as well as about users' rights and the mechanisms for their implementation.",
        p3: "By using the Service, you confirm that you have read this Policy. If you do not agree, please stop using the platform."
    },
    dataCollected: {
        title: "2. What Data is Collected",
        personal: {
            title: "2.1. Personal",
            items: [
                "Name / surname / nickname",
                "Email",
                "Phone",
                "Addresses / directions of sending and receiving",
                "Profile data (avatar, language)"
            ]
        },
        technical: {
            title: "2.2. Technical",
            items: [
                "IP address",
                "Cookies",
                "Browser type, OS, device model",
                "Geolocation (with consent)",
                "Event logs (log, errors)"
            ]
        },
        behavioral: {
            title: "2.3. Behavioral",
            items: [
                "Visited pages",
                "Search / filter queries",
                "Clicks and UI interactions",
                "Session time and login frequency",
                "Conversion statistics (anonymized)"
            ]
        },
        p1: "Sources: data you enter; automatically collected technical logs; analytical tools. We DO NOT collect payment details without direct necessity and do not store them in an open form."
    },
    usage: {
        title: "3. How Data is Used",
        services: {
            title: "3.1 Service Provision",
            p1: "Account registration, authorization, access recovery, creation and processing of delivery requests, display of ratings and interaction history."
        },
        communication: {
            title: "3.2 Communication",
            p1: "Email / push / SMS notifications about shipment statuses, technical messages, support service responses."
        },
        analytics: {
            title: "3.3 Analytics and Improvement",
            p1: "Performance monitoring, error detection, UX optimization, load balancing."
        },
        marketing: {
            title: "3.4 Marketing",
            p1: "Interface and offer personalization, remarketing (with consent), evaluation of advertising campaign effectiveness."
        },
        p1: "Processing is carried out on the basis of: (a) your consent; (b) the necessity to fulfill a contract (offer); (c) the legitimate interests of the Service – maintaining security and developing functionality."
    },
    cta: {
        title: "Create an account",
        p1: "To publish shipments and find carriers faster – register. It takes less than 1 minute.",
        button: "Get started"
    },
      },
      terms: {
        companyName: "Cargix",
        title: "Terms of Use",
        subtitle: "This document is a binding agreement that defines the rules and conditions for using the Cargix platform. Please read it carefully.",
        lastUpdated: "Last updated: {date}",
        general: {
          title: "1. General Provisions",
          p1: "(hereinafter – 'Service', 'we') is the owner and administrator of an online platform for publishing and accepting delivery requests and for interaction between senders and carriers/drivers.",
          p2: "The purpose of these Terms is to define the mutual rights and obligations of users and the Service administration when using the platform.",
          p3: "By using the Service, you confirm that you have read these Terms and agree to them. If you do not agree – stop using the platform."
        },
        account: {
          title: "2. Registration and Account",
          p1: "To access the full functionality of the Service, you must create an account by providing accurate and up-to-date information.",
          p2: "You are responsible for maintaining the confidentiality of your account and password, as well as for all activities performed under your account."
        },
        userRights: {
          title: "3. User rights and obligations",
          rights: {
            title: "User rights:",
            items: [
              "Use the Service in accordance with its intended purpose.",
              "Publish delivery requests and respond to them.",
              "Communicate with other users via the internal messaging system.",
              "Leave reviews and ratings."
            ]
          },
          obligations: {
            title: "User obligations:",
            items: [
              "Provide truthful information.",
              "Do not place items prohibited for shipment.",
              "Follow agreements reached with other users.",
              "Behave politely and ethically."
            ]
          }
        },
        liability: {
          title: "4. Liability",
          p1: "The Service is a platform for connecting users and is not responsible for the quality of carriers' services, the safety of shipments, or any agreements between users.",
          p2: "Users resolve any disputes that may arise between them independently."
        },
        ip: {
          title: "5. Intellectual Property",
          p1: "All intellectual property rights to the Service and its content (except user content) belong to {companyName}."
        },
        final: {
          title: "6. Final Provisions",
          p1: "We reserve the right to change these Terms at any time. Changes take effect from the moment they are published on the website."
        },
        cta: {
          title: "Create an account",
          p1: "To publish shipments and find carriers faster – register. It takes less than 1 minute.",
          button: "Get started"
        }
  },
      profile: {
        nameFallback: "User name",
        missing: "Not specified",
        loading: "Loading profile...",
        uploading: "Uploading...",
        changePhoto: "Change photo",
        rating: "Rating",
        editProfile: "Edit profile",
        adminPanel: "Admin panel",
        tabs: {
          profile: "Profile",
          trips: "My trips",
          orders: "My orders",
          reviews: "My reviews",
          requests: "My requests",
          offers: "My offers"
        },
        fields: {
          firstName: "First name",
          lastName: "Last name",
          email: "Email",
          birthDate: "Birth date",
          phoneNumber: "Phone number",
          address: "Address",
          aboutMe: "About me"
        },
        myOrders: {
          title: "My orders",
          loading: "Loading...",
          noOrders: "No orders",
          driver: "Driver",
          departure: "departure",
          arrival: "arrival",
          orderStatus: "Order status:",
          status: {
            declined: "Declined",
            delivered: "Delivered",
            inTransit: "In transit",
            confirmed: "Confirmed",
            awaitingConfirmation: "Awaiting confirmation"
          },
          comment: "Comment",
          handedToDriver: "Handed to driver",
          deliveredToRecipient: "Delivered to recipient",
          cost: "Cost",
          currency: "UAH",
          tripDetails: "Trip details",
          goToChat: "Go to chat",
          leaveReview: "Leave a review"
        },
        myTrips: {
          title: "My trips",
          loading: "Loading...",
          noTrips: "No trips",
          driver: "Driver",
          departure: "departure",
          arrival: "arrival",
          orders: "Orders:",
          noOrders: "No orders",
          sender: "Sender",
          phone: "Phone",
          status: "Status",
          statusValues: {
            delivered: "Delivered",
            inTransit: "In transit",
            confirmed: "Confirmed",
            awaitingConfirmation: "Awaiting confirmation"
          },
          goToChat: "Go to chat",
          confirm: "Confirm",
          decline: "Decline",
          leaveReview: "Leave a review",
          minCost: "Minimum cost",
          priceDisclaimer: "Price may vary depending on parcel size",
          details: "Details",
          startTrip: "Start trip",
          completeTrip: "Complete trip",
          tripCompleted: "Trip completed",
          currency: "UAH"
        },
        myOffers: {
          title: "My delivery offers",
          loading: "Loading...",
          noOffers: "No offers",
          deliveryRequest: "Delivery request",
          sender: "Sender",
          departure: "Departure",
          arrival: "Arrival",
          cargo: "Cargo",
          type: "Type",
          weight: "Weight",
          description: "Description",
          comment: "Comment",
          yourOffer: "Your offer",
          status: "Status",
          statusValues: {
            declined: "Declined",
            accepted: "Accepted",
            awaitingConfirmation: "Awaiting confirmation"
          },
          priceNotSpecified: "Price not specified",
          collection: "Collection",
          delivery: "Delivery",
          requestDetails: "Request details",
          goToChat: "Go to chat",
          leaveReview: "Leave a review",
          currency: "UAH"
        },
        myRequests: {
          title: "My delivery requests",
          loading: "Loading...",
          noRequests: "No requests",
          departure: "Departure",
          arrival: "Arrival",
          cargo: "Cargo",
          type: "Type",
          weight: "Weight",
          description: "Description",
          comment: "Comment",
          status: "Status",
          statusValues: {
            delivered: "Delivered",
            pickedUp: "Picked up",
            awaiting: "Awaiting"
          },
          pickedUp: "Picked up",
          delivered: "Delivered",
          driverOffers: "Driver offers:",
          noOffers: "No offers",
          driver: "Driver",
          price: "Price",
          collection: "Collection",
          delivery: "Delivery",
          offerStatus: "Status",
          offerStatusValues: {
            declined: "Declined",
            accepted: "Accepted",
            awaitingConfirmation: "Awaiting confirmation"
          },
          accept: "Accept",
          decline: "Decline",
          goToChat: "Go to chat",
          priceNotSpecified: "Price not specified",
          requestDetails: "Request details",
          currency: "UAH"
        },
        myReviews: {
          title: "My reviews",
          noReviews: "No reviews yet.",
          time: "Time",
          from: "From",
          review: "Review"
        }
      },
  footer: {
    helpCenter: "Visit Help Center",
    delivery: "Delivery",
    calculateCost: "Calculate cost",
    requestList: "Request list",
    tripList: "Trip list",
    features: "Features",
    latestNews: "Latest news",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    service: "Service",
    aboutUs: "About us",
    copyright: "© 2025 Cargix.",
    cookies: "Cookies",
    policy: "Policy",
    security: "Security"
  },
  newsPage: {
    main: "Home",
    news: "News",
    title: "News and updates",
    lastUpdated: "Last updated {date}",
    subtitle: "Here you will find the latest news, service updates and useful delivery tips. Follow the changes to be aware of new opportunities and promotions on the Cargix platform.",
    allAuthors: "All authors",
    allCategories: "All categories",
    published: "Published: {date}"
  },
  helpPage: {
    title: "Help and FAQs",
    searchPlaceholder: "Search...",
    nothingFound: "Nothing found.",
    joinMovement: {
      title: "Join the movement",
      p1: "Cargix is more than just a delivery platform. It's a community of helpers, travelers, and everyday heroes.",
      list: [
        "You need to deliver a package quickly and affordably",
        "You are a traveler who wants to earn money by helping others",
        "You believe in smarter, greener solutions"
      ],
      p2: "...Cargix is here for you.",
      p3: "Register today and become part of a global change in how we send and receive packages. Together, we are creating a world where every journey matters.",
      joinButton: "Join"
    },
    faq: {
      about: {
        title: "About the service",
        items: [
          {
            question: "What is Cargix?",
            answer: "Cargix is a platform that turns already happening trips into an opportunity to send things faster, cheaper, and with less environmental impact. We connect people and make delivery more humane and intelligent."
          },
          {
            question: "How does the delivery system work?",
            answer: "We connect those who want to send items with drivers who are already heading in the right direction. We use free trunk space, reduce empty kilometers, save your time and money, and reduce CO₂ emissions."
          },
          {
            question: "What are the core principles of Cargix?",
            answer: "Our core principles are: humanity (live dialogue and mutual respect), efficiency (using planned trips), trust (profiles, delivery history, reviews, verification), and eco-friendliness (reducing empty kilometers)."
          },
          {
            question: "In which cities does the service operate?",
            answer: "The service is available in many cities in Ukraine, including Kyiv, Lviv, Kharkiv, Odesa, Dnipro, Chernivtsi, Uzhhorod, and others. We are constantly expanding our geography."
          }
        ]
      },
      driver: {
        title: "For drivers",
        items: [
          {
            question: "How to become a parcel delivery service driver?",
            answer: "Register in the app, add information about your vehicle, and pass identity verification."
          },
          {
            question: "How to get a delivery order?",
            answer: "You will receive notifications about new orders in the app. Choose a suitable order and confirm it."
          },
          {
            question: "How is payment for delivery made?",
            answer: "Payment is made automatically through the app after successful delivery of the parcel."
          },
          {
            question: "What to do in case of delivery problems?",
            answer: "Contact the support service through the app or call the hotline."
          },
          {
            question: "What benefits do I get as a Cargix driver?",
            answer: "You can earn extra income from each delivery, choose trips according to your schedule, and use an intuitive interface to quickly add routes and accept orders without unnecessary calls."
          },
          {
            question: "How is the delivery cost for the driver determined?",
            answer: "The cost is based on distance, volume, weight, and other shipment parameters. The system offers a fair price range, taking all factors into account."
          }
        ]
      },
      sender: {
        title: "For senders",
        items: [
          {
            question: "How to arrange a parcel delivery?",
            answer: "Create an order in the app, specify the recipient's address and parcel details."
          },
          {
            question: "How to track the delivery status?",
            answer: "You can view the delivery status in the app in real time."
          },
          {
            question: "What items are prohibited for sending?",
            answer: "It is forbidden to send dangerous, illegal, or prohibited by law items. The list is available in the service rules."
          },
          {
            question: "What to do if the parcel was not delivered?",
            answer: "Contact the support service to resolve the issue and receive compensation, if provided."
          },
          {
            question: "How to calculate the delivery cost?",
            answer: "Specify the city of departure and destination, weight, and dimensions of the parcel. The system will automatically select the best options and offer a cost range."
          },
          {
            question: "Can I communicate with the driver directly?",
            answer: "Yes, you can communicate with the driver through the built-in chat in the app to clarify delivery details."
          }
        ]
      },
      security: {
        title: "Security and trust",
        items: [
          {
            question: "How are drivers verified?",
            answer: "We implement multi-level verification: email, phone, document verification, and voluntary car confirmation. The system also analyzes behavior patterns and reacts before complaints arise."
          },
          {
            question: "What is a trust rating?",
            answer: "The trust rating is formed based on the algorithmic weighting of recent ratings and trust signals. This helps users choose verified drivers."
          },
          {
            question: "Is the chat protected from fraud?",
            answer: "Yes, our chat has automatic hiding of suspicious links and phishing templates to protect users."
          },
          {
            question: "Is shipment insurance provided?",
            answer: "We are working on implementing a partial insurance coverage model and optional surcharges. This feature is being prepared for future launch."
          }
        ]
      },
      pricing: {
        title: "Prices and payment",
        items: [
          {
            question: "What does the delivery cost depend on?",
            answer: "The cost depends on the distance, weight, volume of the parcel, type of transfer, and other factors. The system selects the best options taking into account all parameters."
          },
          {
            question: "How can I reduce the delivery cost?",
            answer: "To reduce the cost, you can consider a more flexible date, change the transfer point, or combine the shipment with another request."
          },
          {
            question: "What payment methods are available?",
            answer: "Payment is made through the app using a bank card or other electronic payment methods."
          },
          {
            question: "Is there a discount system for regular customers?",
            answer: "Yes, we are implementing a loyalty system for regular customers, which allows them to receive discounts on future shipments."
          }
        ]
      },
      eco: {
        title: "Environmental impact",
        items: [
          {
            question: "How does Cargix affect the environment?",
            answer: "We reduce 'empty kilometers' and encourage combining small shipments for a smaller carbon footprint. Every shared delivery is a small step towards sustainability."
          },
          {
            question: "How much CO₂ has been saved thanks to the service?",
            answer: "According to our estimates, the service has helped save about 18 tons of CO₂ by optimizing routes and using already planned trips."
          },
          {
            question: "Are there any additional environmental initiatives?",
            answer: "We are constantly developing new methods for optimizing cargo space and planning routes for even greater reduction of CO₂ emissions."
          }
        ]
      },
      technical: {
        title: "Technical questions",
        items: [
          {
            question: "What to do if the app is not working?",
            answer: "Check your internet connection, update the app to the latest version, or restart your device. If the problem persists, contact the support service."
          },
          {
            question: "How to change personal data in the profile?",
            answer: "Open the 'Profile' section in the app, click the edit button, and make the necessary changes."
          },
          {
            question: "Can I use the service without a mobile app?",
            answer: "Yes, you can use the web version of the service through a browser on your computer or mobile device."
          },
          {
            question: "How to contact the support service?",
            answer: "You can contact us through the feedback form in the app, send an email to support@cargix.com, or call the hotline."
          }
        ]
      }
    }
  }
  ,
  requestList: {
    heroTitle: "Find a delivery request",
    filters: {
      from: "From",
      to: "To",
      size: "Size",
      sizes: {
        xs: "XS up to 1 kg",
        s: "S up to 5 kg",
        m: "M up to 15 kg",
        l: "L up to 30 kg",
        xl: "XL up to 60 kg",
        xxl: "XXL from 61 kg",
      },
    },
    buttons: {
      find: "Find request",
      create: "Create request",
      details: "Details",
    },
    labels: {
      departure: "departure",
      arrival: "arrival",
      sender: "Sender",
      cargo: "Cargo",
      type: "Type",
      weight: "Weight",
      kg: "kg",
      description: "Description",
      comment: "Comment",
    },
    currency: "UAH",
    priceNotSpecified: "Price not specified",
    loading: "Loading...",
    empty: "No available requests",
  }
  ,
  tripList: {
    heroTitle: "Send your parcel now",
    filters: {
      from: "From",
      to: "To",
      size: "Size",
      sizes: {
        xs: "XS up to 1 kg",
        s: "S up to 5 kg",
        m: "M up to 15 kg",
        l: "L up to 30 kg",
        xl: "XL up to 60 kg",
        xxl: "XXL from 61 kg",
      },
    },
    buttons: {
      find: "Find a ride",
      addTrip: "Add trip",
      choose: "Choose",
    },
    sidebar: {
      filtersTitle: "Filters",
      price: "Price",
      driverRating: "Driver rating",
      placeholders: { from: "From", to: "To" },
    },
    loading: "Loading...",
    empty: "No available trips",
    labels: { driver: "Driver", departure: "departure", arrival: "arrival" },
    currency: "UAH",
    priceDisclaimer: "Price may vary depending on parcel size",
  }
  ,
  editProfile: {
    loading: "Loading...",
    title: "Edit profile",
    subtitle: "Update your personal information.",
    emailRequired: "Email is required.",
    emailInvalid: "Enter a valid email address.",
    firstNameMinLength: "First name must be at least 3 characters.",
    middleNameMinLength: "Middle name must be at least 3 characters.",
    lastNameMinLength: "Last name must be at least 3 characters.",
    aboutMeMinLength: "About me must be at least 3 characters.",
    successMessage: "Profile updated successfully.",
    errorMessage: "An error occurred while saving. Please try again.",
    emailLabel: "E-mail",
    emailPlaceholder: "Enter your email",
    firstNameLabel: "First name",
    firstNamePlaceholder: "Enter your first name",
    middleNameLabel: "Middle name",
    middleNamePlaceholder: "Enter your middle name",
    lastNameLabel: "Last name",
    lastNamePlaceholder: "Enter your last name",
    birthDateLabel: "Date of birth",
    aboutMeLabel: "About me",
    aboutMePlaceholder: "Tell something about yourself",
    cancelButton: "Cancel",
    saveButton: "Save",
    savingButton: "Saving..."
  }
  ,
  supportChat: {
    widgetTitle: "Support chat",
    greetingBot: "Welcome! I'm your AI assistant.",
    noReply: "No reply",
    errorPrefix: "Error: ",
    sendError: "Failed to send message",
    loading: "Generating a response...",
    inputPlaceholder: "Your question...",
    send: "Send",
    openAria: "Open support chat"
  }
};

export default messages;