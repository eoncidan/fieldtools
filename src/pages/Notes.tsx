import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Notes: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes_data', []);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const currentNote = selectedNote ? notes.find(note => note.id === selectedNote) : null;

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Nova Anotação',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    if (confirm('Deseja excluir esta anotação?')) {
      setNotes(prev => prev.filter(note => note.id !== id));
      if (selectedNote === id) {
        setSelectedNote(null);
      }
    }
  };

  const handleContentChange = (content: string) => {
    if (!selectedNote) return;

    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(() => {
      updateNote(selectedNote, { content });
    }, 500); // Auto-save after 500ms of inactivity

    setAutoSaveTimeout(timeout);

    // Update local state immediately for responsive UI
    setNotes(prev => prev.map(note =>
      note.id === selectedNote
        ? { ...note, content, updatedAt: new Date() }
        : note
    ));
  };

  const handleTitleChange = (title: string) => {
    if (!selectedNote) return;
    updateNote(selectedNote, { title });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bloco de Rascunho
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Suas anotações salvas automaticamente
          </p>
        </div>
        
        <button
          onClick={createNewNote}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova Anotação</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Notes List */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-hidden flex flex-col">
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar anotações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note.id)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors duration-200 group
                    ${selectedNote === note.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {note.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {note.content || 'Anotação vazia'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {format(new Date(note.updatedAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhuma anotação encontrada' : 'Nenhuma anotação criada'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
          {currentNote ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={currentNote.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-xl font-semibold bg-transparent text-gray-900 dark:text-white border-none outline-none focus:ring-0 p-0"
                  placeholder="Título da anotação"
                />
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Criado: {format(new Date(currentNote.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                  <span>
                    Atualizado: {format(new Date(currentNote.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <textarea
                  value={currentNote.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Comece a escrever suas anotações aqui..."
                  className="w-full h-full resize-none bg-transparent text-gray-900 dark:text-white border-none outline-none focus:ring-0 text-base leading-relaxed"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Selecione uma anotação
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Escolha uma anotação da lista ou crie uma nova
                </p>
                <button
                  onClick={createNewNote}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  Criar Nova Anotação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto-save indicator */}
      {autoSaveTimeout && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
          Salvando...
        </div>
      )}
    </div>
  );
};