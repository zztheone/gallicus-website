// Wait for both DOM and OrbitalTimeline to be ready
function initBenefitsOrbital() {
  if (typeof OrbitalTimeline === 'undefined') {
    // Retry after a short delay
    setTimeout(initBenefitsOrbital, 50);
    return;
  }

  const benefits = [
    {
      id: 1,
      title: 'Productivité décuplée',
      description: 'Libérez vos équipes des tâches répétitives pour se concentrer sur la valeur ajoutée.',
      icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`
    },
    {
      id: 2,
      title: 'Fiabilité optimale',
      description: 'Réduisez les erreurs humaines et assurez une qualité constante dans vos processus.',
      icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
      </svg>`
    },
    {
      id: 3,
      title: 'Rapidité d\'exécution',
      description: 'Accélérez vos opérations et répondez plus vite aux demandes de vos clients.',
      icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>`
    },
    {
      id: 4,
      title: 'Rapports et insights',
      description: 'Accédez à des données en temps réel pour prendre des décisions éclairées.',
      icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>`
    },
    {
      id: 5,
      title: 'Disponibilité 24/7',
      description: 'Vos processus automatisés fonctionnent sans interruption, jour et nuit.',
      icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`
    },
    {
      id: 6,
      title: 'Réduction des coûts',
      description: 'Optimisez vos dépenses opérationnelles et maximisez votre retour sur investissement.',
      icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
      </svg>`
    }
  ];

  new OrbitalTimeline('benefits-orbital', benefits);
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBenefitsOrbital);
} else {
  initBenefitsOrbital();
}
