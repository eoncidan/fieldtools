import React, { useState } from 'react';
import { 
  DocumentIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';

interface Item {
  id: string;
  quantidade: string;
  peso: string;
  valor: string;
  descricao: string;
}

interface FormData {
  destinatarioNome: string;
  destinatarioCpfCnpj: string;
  destinatarioEndereco: string;
  destinatarioCidadeUf: string;
  destinatarioCep: string;
  destinatarioCC: string;
  destinatarioContato: string;
  itens: Item[];
}

export const GDC: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    destinatarioNome: '',
    destinatarioCpfCnpj: '',
    destinatarioEndereco: '',
    destinatarioCidadeUf: '',
    destinatarioCep: '',
    destinatarioCC: '',
    destinatarioContato: '',
    itens: [{ id: '1', quantidade: '', peso: '', valor: '', descricao: '' }]
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      quantidade: '',
      peso: '',
      valor: '',
      descricao: ''
    };
    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, newItem]
    }));
  };

  const removeItem = (id: string) => {
    if (formData.itens.length > 1) {
      setFormData(prev => ({
        ...prev,
        itens: prev.itens.filter(item => item.id !== id)
      }));
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'destinatarioNome',
      'destinatarioCpfCnpj',
      'destinatarioEndereco',
      'destinatarioCidadeUf',
      'destinatarioCep',
      'destinatarioCC',
      'destinatarioContato'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        alert(`Campo obrigatório: ${field.replace('destinatario', '').replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    const hasValidItems = formData.itens.some(item => 
      item.quantidade && item.peso && item.valor && item.descricao
    );

    if (!hasValidItems) {
      alert('Adicione pelo menos um item completo');
      return false;
    }

    return true;
  };

  const generatePDF = () => {
    if (!validateForm()) return;

    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      
      // Primeira página - Declaração de Conteúdo
      doc.setFontSize(16);
      doc.text('DECLARAÇÃO DE CONTEÚDO', 105, 30, { align: 'center' });
      
      // Dados do destinatário
      doc.setFontSize(12);
      doc.text('DADOS DO DESTINATÁRIO:', 20, 50);
      
      let yPos = 65;
      doc.setFontSize(10);
      doc.text(`Nome: ${formData.destinatarioNome}`, 20, yPos);
      yPos += 10;
      doc.text(`CPF/CNPJ: ${formData.destinatarioCpfCnpj}`, 20, yPos);
      yPos += 10;
      doc.text(`Endereço: ${formData.destinatarioEndereco}`, 20, yPos);
      yPos += 10;
      doc.text(`Cidade/UF: ${formData.destinatarioCidadeUf}`, 20, yPos);
      yPos += 10;
      doc.text(`CEP: ${formData.destinatarioCep}`, 20, yPos);
      
      // Discriminação do conteúdo
      yPos += 20;
      doc.setFontSize(12);
      doc.text('DISCRIMINAÇÃO DO CONTEÚDO:', 20, yPos);
      
      yPos += 15;
      doc.setFontSize(9);
      doc.text('Qtd', 20, yPos);
      doc.text('Peso', 40, yPos);
      doc.text('Valor', 60, yPos);
      doc.text('Descrição', 80, yPos);
      
      yPos += 5;
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
      
      // Itens
      const validItems = formData.itens.filter(item => 
        item.quantidade && item.peso && item.valor && item.descricao
      );
      
      validItems.forEach(item => {
        if (yPos > 250) { // Check if we need a new page
          doc.addPage();
          yPos = 30;
        }
        
        doc.text(item.quantidade, 20, yPos);
        doc.text(item.peso, 40, yPos);
        doc.text(`R$ ${item.valor}`, 60, yPos);
        
        // Handle long descriptions
        const description = item.descricao;
        if (description.length > 50) {
          const lines = doc.splitTextToSize(description, 100);
          doc.text(lines, 80, yPos);
          yPos += lines.length * 5;
        } else {
          doc.text(description, 80, yPos);
          yPos += 10;
        }
      });
      
      // Espaço para data e assinatura
      yPos += 30;
      if (yPos > 250) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.text('Data: ___/___/______', 20, yPos);
      yPos += 20;
      doc.text('Assinatura: _________________________________', 20, yPos);
      
      // Segunda página - Etiqueta de envio
      doc.addPage();
      doc.setFontSize(16);
      doc.text('ETIQUETA DE ENVIO', 105, 30, { align: 'center' });
      
      // Criar um retângulo para a etiqueta
      doc.rect(20, 50, 170, 100);
      
      doc.setFontSize(12);
      let etiquetaY = 70;
      doc.text(`Nome: ${formData.destinatarioNome}`, 30, etiquetaY);
      etiquetaY += 12;
      doc.text(`C. de custo: ${formData.destinatarioCC}`, 30, etiquetaY);
      etiquetaY += 12;
      doc.text(`Endereço: ${formData.destinatarioEndereco}`, 30, etiquetaY);
      etiquetaY += 12;
      doc.text(`Cidade/UF: ${formData.destinatarioCidadeUf}`, 30, etiquetaY);
      etiquetaY += 12;
      doc.text(`CEP: ${formData.destinatarioCep}`, 30, etiquetaY);
      etiquetaY += 12;
      doc.text(`Contato: ${formData.destinatarioContato}`, 30, etiquetaY);
      
      // Salvar o PDF
      const fileName = `declaracao-conteudo-${formData.destinatarioNome.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o documento. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const printDocument = () => {
    if (!validateForm()) return;
    
    // Para impressão, podemos abrir uma nova janela com o conteúdo formatado
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const validItems = formData.itens.filter(item => 
        item.quantidade && item.peso && item.valor && item.descricao
      );
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Declaração de Conteúdo</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .section-title { font-weight: bold; margin-bottom: 10px; }
              .item-row { display: flex; margin-bottom: 5px; }
              .item-col { margin-right: 20px; }
              .signature { margin-top: 50px; }
              .etiqueta { border: 2px solid #000; padding: 20px; margin-top: 50px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">DECLARAÇÃO DE CONTEÚDO</div>
            
            <div class="section">
              <div class="section-title">DADOS DO DESTINATÁRIO:</div>
              <div>Nome: ${formData.destinatarioNome}</div>
              <div>CPF/CNPJ: ${formData.destinatarioCpfCnpj}</div>
              <div>Endereço: ${formData.destinatarioEndereco}</div>
              <div>Cidade/UF: ${formData.destinatarioCidadeUf}</div>
              <div>CEP: ${formData.destinatarioCep}</div>
            </div>
            
            <div class="section">
              <div class="section-title">DISCRIMINAÇÃO DO CONTEÚDO:</div>
              ${validItems.map(item => `
                <div class="item-row">
                  <div class="item-col">Qtd: ${item.quantidade}</div>
                  <div class="item-col">Peso: ${item.peso}</div>
                  <div class="item-col">Valor: R$ ${item.valor}</div>
                  <div class="item-col">Descrição: ${item.descricao}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="signature">
              <div>Data: ___/___/______</div>
              <br>
              <div>Assinatura: _________________________________</div>
            </div>
            
            <div style="page-break-before: always;">
              <div class="header">ETIQUETA DE ENVIO</div>
              <div class="etiqueta">
                <div>Nome: ${formData.destinatarioNome}</div>
                <div>C. de custo: ${formData.destinatarioCC}</div>
                <div>Endereço: ${formData.destinatarioEndereco}</div>
                <div>Cidade/UF: ${formData.destinatarioCidadeUf}</div>
                <div>CEP: ${formData.destinatarioCep}</div>
                <div>Contato: ${formData.destinatarioContato}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerador de Declaração de Conteúdo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Preencha os dados para gerar a declaração e etiqueta de envio
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <form className="space-y-6">
          {/* Dados do Destinatário */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Dados do Destinatário
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.destinatarioNome}
                  onChange={(e) => updateField('destinatarioNome', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Nome do destinatário"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CPF/CNPJ *
                </label>
                <input
                  type="text"
                  value={formData.destinatarioCpfCnpj}
                  onChange={(e) => updateField('destinatarioCpfCnpj', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  value={formData.destinatarioEndereco}
                  onChange={(e) => updateField('destinatarioEndereco', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Rua, número, complemento"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cidade/UF *
                </label>
                <input
                  type="text"
                  value={formData.destinatarioCidadeUf}
                  onChange={(e) => updateField('destinatarioCidadeUf', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Cidade - UF"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  value={formData.destinatarioCep}
                  onChange={(e) => updateField('destinatarioCep', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="00000-000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Centro de Custo *
                </label>
                <input
                  type="text"
                  value={formData.destinatarioCC}
                  onChange={(e) => updateField('destinatarioCC', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Código do centro de custo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contato *
                </label>
                <input
                  type="text"
                  value={formData.destinatarioContato}
                  onChange={(e) => updateField('destinatarioContato', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Telefone ou e-mail"
                />
              </div>
            </div>
          </div>

          {/* Itens do Conteúdo */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Discriminação do Conteúdo
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Adicionar Item</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.itens.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantidade
                    </label>
                    <input
                      type="text"
                      value={item.quantidade}
                      onChange={(e) => updateItem(item.id, 'quantidade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: 2 unid"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Peso
                    </label>
                    <input
                      type="text"
                      value={item.peso}
                      onChange={(e) => updateItem(item.id, 'peso', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: 1.5kg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valor
                    </label>
                    <input
                      type="text"
                      value={item.valor}
                      onChange={(e) => updateItem(item.id, 'valor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: 150.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={item.descricao}
                      onChange={(e) => updateItem(item.id, 'descricao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Descrição do item"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={formData.itens.length === 1}
                      className="w-full px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>{isGenerating ? 'Gerando...' : 'Baixar PDF'}</span>
            </button>
            
            <button
              type="button"
              onClick={printDocument}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <PrinterIcon className="h-5 w-5" />
              <span>Imprimir</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};