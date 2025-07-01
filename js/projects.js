// Project detail functionality
class ProjectManager {
    constructor() {
        this.cards = document.querySelectorAll('.card');
        this.blackSection = document.getElementById('black-section');
        this.cardsContainer = document.getElementById('cards-container');
        this.projectDetailsContainer = document.getElementById('project-details-container');
        this.projectDetailsInline = document.querySelectorAll('.project-detail-inline');
        this.closeBtn = document.getElementById('close-project-btn');
        this.init();
    }

    init() {
        this.setupCardClickHandlers();
        this.setupCloseButton();
    }

    setupCardClickHandlers() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                const cardId = card.id.toLowerCase();
                const detailId = cardId + '-detail-inline';
                
                this.showProjectDetail(detailId);
            });
        });
    }

    showProjectDetail(detailId) {
        // Add detail view classes
        this.blackSection.classList.add('detail-view');
        this.cardsContainer.classList.add('detail-active');
        this.projectDetailsContainer.classList.add('active');
        
        // Hide all project details first
        this.projectDetailsInline.forEach(detail => {
            detail.classList.remove('active');
        });
        
        // Show selected project detail
        const projectDetail = document.getElementById(detailId);
        if (projectDetail) {
            setTimeout(() => {
                projectDetail.classList.add('active');
            }, 300);
        }
    }

    setupCloseButton() {
        this.closeBtn.addEventListener('click', () => {
            this.hideProjectDetail();
        });
    }

    hideProjectDetail() {
        // Remove detail view classes in the right order
        this.projectDetailsContainer.classList.remove('active');
        
        // Let the project details fade out first, then bring cards back
        setTimeout(() => {
            this.blackSection.classList.remove('detail-view');
            this.cardsContainer.classList.remove('detail-active');
            
            // Hide all project details
            this.projectDetailsInline.forEach(detail => {
                detail.classList.remove('active');
            });
        }, 300);
    }
}

// Initialize project manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectManager();
});