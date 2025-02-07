export const LEGAL_CONTENT = {
  terms: {
    title: 'Terms and Conditions',
    lastUpdated: 'February 07, 2025',
    sections: [
      {
        title: 'Interpretation and Definitions',
        content: 'The words of which the initial letter is capitalized have meanings defined under the following conditions.',
        subsections: [
          {
            title: 'Definitions',
            list: [
              'Application means CheckMate, a task management web application',
              'Company (referred to as "We", "Us" or "Our") refers to CheckMate',
              'Service refers to the Application accessible at checkmate.marco5dev.me',
              'Authentication Platforms refers to third-party login services including GitHub and other supported platforms',
              'Account means a unique account created for You to access our Service',
              'You means the individual accessing or using the Service'
            ]
          }
        ]
      },
      {
        title: 'Account Registration and Authentication',
        content: 'You can create an account using email/password or through supported authentication platforms like GitHub. By using third-party authentication, you agree to their respective terms of service.',
        list: [
          'You must be at least 18 years old to use the Service',
          'You are responsible for maintaining your account security',
          'You can login using GitHub or other supported platforms',
          'You must provide accurate and complete information during registration'
        ]
      },
      {
        title: 'Service Usage and Limitations',
        content: 'CheckMate provides task management and organization features under the following conditions:',
        list: [
          'The Service is provided "AS IS" without warranties',
          'We reserve the right to modify or discontinue features',
          'You agree not to misuse or abuse the Service',
          'Data storage and task limits may apply'
        ]
      }
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'February 07, 2025',
    sections: [
      {
        title: 'Introduction',
        content: 'This Privacy Policy describes our policies on the collection, use, and disclosure of your information when you use CheckMate. By using our Service, you agree to the collection and use of information in accordance with this policy.',
      },
      {
        title: 'Information We Collect',
        subsections: [
          {
            title: 'Personal Data',
            content: 'While using CheckMate, we may collect:',
            list: [
              'Email address',
              'GitHub profile information (when using GitHub authentication)',
              'First and last name',
              'Tasks and notes content',
              'Usage preferences and settings'
            ]
          },
          {
            title: 'Usage Data',
            content: 'We automatically collect usage information when you access CheckMate:',
            list: [
              'Browser type and version',
              'Time spent on pages',
              'Access times and dates',
              'Interaction patterns with the application'
            ]
          }
        ]
      },
      {
        title: 'Authentication and Third-Party Services',
        content: 'CheckMate allows you to create an account and log in through:',
        list: [
          'Email/password authentication',
          'GitHub OAuth',
          'Other supported authentication providers'
        ],
        subsections: [
          {
            title: 'Third-Party Data',
            content: 'When you authenticate through GitHub or other services, we may collect data associated with that account, such as:',
            list: [
              'Your public profile information',
              'Email address',
              'Avatar image'
            ]
          }
        ]
      },
      {
        title: 'How We Use Your Data',
        content: 'We use your personal data to:',
        list: [
          'Provide and maintain CheckMate',
          'Manage your account and preferences',
          'Contact you about service updates',
          'Improve our features and user experience',
          'Detect and prevent technical issues'
        ]
      },
      {
        title: 'Data Security',
        content: 'We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.',
      },
      {
        title: 'Your Data Rights',
        content: 'You can:',
        list: [
          'Access your personal data',
          'Correct inaccurate data',
          'Request data deletion',
          'Export your tasks and notes',
          'Close your account'
        ]
      },
      {
        title: 'Updates to Privacy Policy',
        content: 'We may update this Privacy Policy periodically. We will notify you of any material changes via email or through the application.'
      }
    ]
  }
};
