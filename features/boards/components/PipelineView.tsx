import React from 'react';
import { DealDetailModal } from './Modals/DealDetailModal';
import { CreateDealModal } from './Modals/CreateDealModal';
import { CreateBoardModal } from './Modals/CreateBoardModal';
import { BoardCreationWizard } from './BoardCreationWizard';
import { KanbanHeader } from './Kanban/KanbanHeader';
import { BoardStrategyHeader } from './Kanban/BoardStrategyHeader';
import { KanbanBoard } from './Kanban/KanbanBoard';
import { KanbanList } from './Kanban/KanbanList';
import { DeleteBoardModal } from './Modals/DeleteBoardModal';
import { LossReasonModal } from '@/components/ui/LossReasonModal';
import { DealView, CustomFieldDefinition, Board, BoardStage } from '@/types';
import { ExportTemplateModal } from './Modals/ExportTemplateModal';
import { useAuth } from '@/context/AuthContext';
import PageLoader from '@/components/PageLoader';

interface PipelineViewProps {
  boards: Board[];
  activeBoard: Board | null;
  activeBoardId: string | null;
  handleSelectBoard: (id: string) => void;
  handleCreateBoard: (board: Omit<Board, 'id' | 'createdAt'>, order?: number) => void;
  createBoardAsync?: (board: Omit<Board, 'id' | 'createdAt'>, order?: number) => Promise<Board>;
  updateBoardAsync?: (id: string, updates: Partial<Board>) => Promise<void>;
  handleEditBoard: (board: Board) => void;
  handleUpdateBoard: (board: Omit<Board, 'id' | 'createdAt'>) => void;
  handleDeleteBoard: (id: string) => void;
  confirmDeleteBoard: () => void;
  boardToDelete: any;
  setBoardToDelete: (board: any) => void;
  setTargetBoardForDelete: (targetBoardId: string) => void;
  availableBoardsForMove: Board[];
  isCreateBoardModalOpen: boolean;
  setIsCreateBoardModalOpen: (isOpen: boolean) => void;
  isWizardOpen: boolean;
  setIsWizardOpen: (isOpen: boolean) => void;
  editingBoard: Board | null;
  setEditingBoard: (board: Board | null) => void;

  viewMode: 'kanban' | 'list';
  setViewMode: (mode: 'kanban' | 'list') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  ownerFilter: 'all' | 'mine';
  setOwnerFilter: (filter: 'all' | 'mine') => void;
  statusFilter: 'open' | 'won' | 'lost' | 'all';
  setStatusFilter: (filter: any) => void;

  draggingId: string | null;
  selectedDealId: string | null;
  setSelectedDealId: (id: string | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;

  openActivityMenuId: string | null;
  setOpenActivityMenuId: (id: string | null) => void;

  filteredDeals: DealView[];
  customFieldDefinitions: CustomFieldDefinition[];
  isLoading: boolean;

  handleDragStart: any;
  handleDragOver: any;
  handleDrop: any;
  handleMoveDealToStage: any;

  handleQuickAddActivity: any;
  setLastMouseDownDealId: any;

  lossReasonModal: any;
  handleLossReasonConfirm: any;
  handleLossReasonClose: any;

  boardCreateOverlay?: { title: string; subtitle?: string } | null;
}

export const PipelineView: React.FC<PipelineViewProps> = (props) => {
  const {
    boards,
    activeBoard,
    activeBoardId,
    handleSelectBoard,
    handleCreateBoard,
    createBoardAsync,
    updateBoardAsync,
    handleEditBoard,
    handleUpdateBoard,
    handleDeleteBoard,
    confirmDeleteBoard,
    boardToDelete,
    setBoardToDelete,
    setTargetBoardForDelete,
    availableBoardsForMove,
    isCreateBoardModalOpen,
    setIsCreateBoardModalOpen,
    isWizardOpen,
    setIsWizardOpen,
    editingBoard,
    setEditingBoard,

    viewMode,
    setViewMode,
    searchTerm,
    setSearchTerm,
    ownerFilter,
    setOwnerFilter,
    statusFilter,
    setStatusFilter,

    draggingId,
    selectedDealId,
    setSelectedDealId,
    isCreateModalOpen,
    setIsCreateModalOpen,

    openActivityMenuId,
    setOpenActivityMenuId,

    filteredDeals,
    customFieldDefinitions,
    isLoading,

    handleDragStart,
    handleDragOver,
    handleDrop,
    handleMoveDealToStage,

    handleQuickAddActivity,
    setLastMouseDownDealId,

    lossReasonModal,
    handleLossReasonConfirm,
    handleLossReasonClose,

    boardCreateOverlay,
  } = props;

  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* HEADER FIXO */}
      {activeBoard && (
        <>
          <KanbanHeader
            boards={boards}
            activeBoard={activeBoard}
            onSelectBoard={handleSelectBoard}
            onCreateBoard={() => setIsWizardOpen(true)}
            onEditBoard={handleEditBoard}
            onDeleteBoard={handleDeleteBoard}
            onExportTemplates={isAdmin ? () => setIsExportModalOpen(true) : undefined}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            ownerFilter={ownerFilter}
            setOwnerFilter={setOwnerFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onNewDeal={() => setIsCreateModalOpen(true)}
          />

          <div className="shrink-0">
            <BoardStrategyHeader board={activeBoard} />
          </div>
        </>
      )}

      {/* BOARD FULLSCREEN */}
      <div className="flex-1 overflow-hidden">
        {!activeBoard ? (
          <div className="h-full flex items-center justify-center">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl"
            >
              Criar primeiro board
            </button>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            stages={activeBoard.stages}
            filteredDeals={filteredDeals}
            draggingId={draggingId}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            setSelectedDealId={setSelectedDealId}
            openActivityMenuId={openActivityMenuId}
            setOpenActivityMenuId={setOpenActivityMenuId}
            handleQuickAddActivity={handleQuickAddActivity}
            setLastMouseDownDealId={setLastMouseDownDealId}
            onMoveDealToStage={handleMoveDealToStage}
          />
        ) : (
          <KanbanList
            stages={activeBoard.stages}
            filteredDeals={filteredDeals}
            customFieldDefinitions={customFieldDefinitions}
            setSelectedDealId={setSelectedDealId}
            openActivityMenuId={openActivityMenuId}
            setOpenActivityMenuId={setOpenActivityMenuId}
            handleQuickAddActivity={handleQuickAddActivity}
            onMoveDealToStage={handleMoveDealToStage}
          />
        )}
      </div>

      {/* MODAIS */}
      <CreateDealModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        activeBoard={activeBoard}
        activeBoardId={activeBoardId ?? undefined}
      />

      <DealDetailModal
        dealId={selectedDealId}
        isOpen={!!selectedDealId}
        onClose={() => setSelectedDealId(null)}
      />

      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => {
          setIsCreateBoardModalOpen(false);
          setEditingBoard(null);
        }}
        onSave={editingBoard ? handleUpdateBoard : handleCreateBoard}
        editingBoard={editingBoard || undefined}
        availableBoards={boards}
        onSwitchEditingBoard={handleEditBoard}
      />

      <BoardCreationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCreate={handleCreateBoard}
        onCreateBoardAsync={createBoardAsync}
        onUpdateBoardAsync={updateBoardAsync}
        onOpenCustomModal={() => setIsCreateBoardModalOpen(true)}
      />

      <DeleteBoardModal
        isOpen={!!boardToDelete}
        onClose={() => setBoardToDelete(null)}
        onConfirm={confirmDeleteBoard}
        boardName={boardToDelete?.name || ''}
        dealCount={boardToDelete?.dealCount || 0}
        availableBoards={availableBoardsForMove}
        selectedTargetBoardId={boardToDelete?.targetBoardId}
        onSelectTargetBoard={setTargetBoardForDelete}
      />

      <LossReasonModal
        isOpen={lossReasonModal?.isOpen ?? false}
        onClose={handleLossReasonClose}
        onConfirm={handleLossReasonConfirm}
        dealTitle={lossReasonModal?.dealTitle}
      />

      {activeBoard && (
        <ExportTemplateModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          boards={boards}
          activeBoard={activeBoard}
          onCreateBoardAsync={createBoardAsync}
        />
      )}
    </div>
  );
};
