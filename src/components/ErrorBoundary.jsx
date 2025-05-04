import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Met à jour l'état pour afficher l'interface de secours
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Vous pouvez enregistrer l'erreur dans un service de journalisation
        console.error('Erreur capturée par ErrorBoundary :', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Interface de secours
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1>Une erreur est survenue.</h1>
                    <p>Veuillez réessayer plus tard.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
