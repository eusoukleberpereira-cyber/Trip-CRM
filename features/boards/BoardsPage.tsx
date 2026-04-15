import React, { useEffect } from 'react';
import { useBoardsController } from './hooks/useBoardsController';
import { PipelineView } from './components/PipelineView';
import { OnboardingModal } from '@/components/OnboardingModal';
import { useFirstVisit } from '@/hooks/useFirstVisit';

export const BoardsPage: React.FC = () => {
    const controller = useBoardsController();
    const { isFirstVisit, completeOnboarding } = useFirstVisit();
    const [showOnboarding, setShowOnboarding] = React.useState(false);

    useEffect(() => {
        if (!controller.boardsFetched) return;

        if (isFirstVisit && controller.boards.length === 0) {
            const timer = setTimeout(() => {
                setShowOnboarding(true);
            }, 500);
            return () => clearTimeout(timer);
        } else if (isFirstVisit && controller.boards.length > 0) {
            completeOnboarding();
        }
    }, [isFirstVisit, controller.boards.length, controller.boardsFetched, completeOnboarding]);

    const handleOnboardingStart = () => {
        setShowOnboarding(false);
        completeOnboarding();
        controller.setIsWizardOpen(true);
    };

    const handleOnboardingSkip = () => {
        setShowOnboarding(false);
        completeOnboarding();
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* 🔥 PIPELINE AGORA OCUPA TUDO */}
            <div className="flex-1 overflow-hidden">
                <PipelineView {...controller} />
            </div>

            <OnboardingModal
                isOpen={showOnboarding}
                onStart={handleOnboardingStart}
                onSkip={handleOnboardingSkip}
            />
        </div>
    );
};

// @deprecated - Use BoardsPage
export const PipelinePage = BoardsPage;
