# 🛠️ FieldTools

O **FieldTools** é uma central utilitária modular desenvolvida em **PowerShell** com interface gráfica (WinForms). O projeto consolida diagnósticos de hardware, atalhos administrativos e uma biblioteca de scripts dinâmicos em um único painel, eliminando a navegação manual repetitiva durante o suporte técnico.

<p align="center">
  <img width="977" height="595" alt="image" src="https://github.com/user-attachments/assets/dba120ca-6f1e-4f16-9cc7-bbf085a487b5" />
  <img src="https://img.shields.io/badge/PowerShell-5.1+-blue.svg?style=for-the-badge&logo=powershell&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white" />
</p>

---

## 💡 Projeto
O FieldTools foi uma ideia que surgiu depois de mais um dia no suporte com diversos gaps e troubleshootings e clica aqui e clica ali e zas, fiquei pensando em como reunir as resoluções de forma organizada e boom, FieldTools.

A ferramenta teve como inspiração varias ferramentas semelhantes como o WinUtils do Chris Titus, Windows 10 Debloater do Sycnex, Sophia Script do Dmitry e outras. A ideia em resumo seria de centralizar as informações do sistema, atalhos para ferramenas nativas, scripts para tweaks ou resolução de problemas frequentes. 

Como o intuito principal era praticar mais e entender melhor o PowerShell a estrutura foi pensada para ser algo customizável e fácil de entender.

---

## ✨ Funcionalidades

### 1. 🖥️ Sistema (`Sistema.ps1`)
Monitoramento assíncrono (sem travar a interface) dos principais componentes:
* **Processador:** Modelo e nome.
* **Memória RAM:** Quantidade total, tipo (DDR3/4/5) e velocidade.
* **Armazenamento:** Espaço livre na partição do sistema (C:) e listagem física de discos (SSD/NVMe/HDD).

### 2. 🔧 Ferramentas (`Ferramentas.ps1`)
Acesso rápido (One-Click) às ferramentas administrativas nativas do Windows, incluindo:
* Gerenciador de Tarefas, Regedit, CMD (Admin).
* Painel de Controle, Serviços, Windows Update.
* Diagnósticos: Memória, PSR (Gravador de Passos), Visualizador de Eventos.

### 3. 📜 Biblioteca de Scripts (`ScriptsLib.ps1`)
**Nova Funcionalidade:** Um motor de execução dinâmica.
* O sistema varre a pasta `/Lib` na raiz do projeto.
* Qualquer arquivo `.ps1` colocado lá é transformado automaticamente em um botão na interface.
* Ideal para scripts de limpeza, correções de registro ou automações personalizadas.

### 4. 📦 Apps (`Apps.ps1`)
*Módulo destinado à centralização de instaladores de aplicações essenciais (Em desenvolvimento).*

---

## 🚀 Como Usar

> [!IMPORTANT]
> A ferramenta requer privilégios de **Administrador** para acessar componentes WMI/CIM e executar tarefas de sistema.

### Instalação e Execução
1. Baixe o repositório.
2. Localize o arquivo `Start.ps1` na raiz.
3. Clique com o botão direito e selecione **"Executar com o PowerShell"**.

O `Start.ps1` irá:
1.  Solicitar elevação de privilégios (UAC) se não estiver como Admin.
2.  Ocultar a janela preta do terminal (Modo Stealth).
3.  Carregar a interface gráfica (`MainGUI.ps1`).

### Adicionando Scripts Personalizados
Para adicionar suas próprias ferramentas à aba **Scripts**:
1.  Crie ou copie seus scripts `.ps1` para a pasta `Lib` (crie a pasta na raiz do projeto se ela não existir).
2.  Reinicie o FieldTools ou navegue para outra aba e volte.
3.  Seu script aparecerá automaticamente listado na grade.

---

## 📂 Estrutura do Projeto

```text
FieldTools/
├── Lib/                 # [Pasta do Usuário] Coloque seus scripts .ps1 aqui
├── Main/
│   └── MainGUI.ps1      # Motor gráfico principal e roteamento
├── Pages/               # Módulos da interface
│   ├── Sistema.ps1      # Coleta de dados de hardware (Async)
│   ├── Ferramentas.ps1  # Launchers nativos do Windows
│   ├── ScriptsLib.ps1   # Leitor dinâmico da pasta Lib
│   └── Apps.ps1         # Gerenciador de aplicações
├── Start.ps1            # Entry Point (Bootstrapper + Admin Check)
└── README.md
