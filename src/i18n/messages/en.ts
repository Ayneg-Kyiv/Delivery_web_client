const en = {
  nav: {
    help: 'Help',
    register: 'Sign up',
    login: 'Sign in'
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
      }
    }
  },
  profile: {
    loading: 'Loading...',
    changePhoto: 'Change photo',
    editProfile: 'Edit profile',
    adminPanel: 'Admin panel',
    rating: 'Rating',
    tabs: {
      profile: 'Profile',
      trips: 'Trips',
      orders: 'Orders',
      reviews: 'Reviews',
      requests: 'Requests',
      offers: 'Offers'
    },
    fields: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'E-mail',
      birthDate: 'Date of birth',
      phoneNumber: 'Phone number',
      address: 'Address',
      aboutMe: 'About me'
    },
    missing: 'Not specified',
    nameFallback: 'Name Second name',
    uploading: 'Uploading...'
  }
} as const;

export type EnMessages = typeof en;
export default en;
