# 🛠️ FieldTools 

O **FieldTools** é uma central utilitária desenvolvida em **PowerShell** com interface gráfica (GUI). O projeto foi criado para consolidar diagnósticos, atalhos do sistema e instaladores em um único painel, eliminando a navegação manual repetitiva durante o suporte técnico.

<p align="center">
  <img width="980" height="596" alt="FieldTools Preview" src="https://github.com/user-attachments/assets/3492eb5e-c0c7-4390-95f2-18e3e3d408a7" />
  <br>
  <img src="https://img.shields.io/badge/PowerShell-%235391FE.svg?style=for-the-badge&logo=powershell&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white" />
</p>

---

## 💡 A Ideia
O projeto surgiu da necessidade de organizar resoluções de problemas comuns de forma estruturada. Inspirado por ferramentas consagradas da comunidade, o FieldTools centraliza o que o Windows tem de melhor (e mais escondido) em uma interface simples, rápida e customizável.

---

## ✨ Funcionalidades Atuais

| Módulo | Descrição |
| :--- | :--- |
| **🔍 Informações de sistema** | Tipo de CPU, RAM e tamanho de disco além de mostrar quanto espaço tem livre. |
| **🔧 Ferramentas** | Atalhos para Regedit, Gerenciador de Dispositivos, Painel de Controle, Event Viewer e mais. |
| **📦 Apps (Winget)** | Instalação silenciosa de softwares essenciais (Notepad++, 7-Zip, HWMonitor). |
| **🎨 Interface Flat** | Painel moderno e responsivo construído inteiramente com WinForms. |

---

## 🚀 Como Executar

> [!IMPORTANT]
> A ferramenta requer privilégios de **Administrador** para acessar componentes do sistema e realizar instalações.

1. Baixe o repositório em uma pasta local.
2. Localize o arquivo `Start.ps1`.
3. Clique com o botão direito e selecione **"Executar com o PowerShell"**.

### O que acontece nos bastidores?
O arquivo `Start.ps1` é o inicializador inteligente do projeto:
* **Elevação:** Verifica e solicita permissão de Admin automaticamente.
* **Discrição:** Oculta a janela preta do console via P/Invoke (`user32.dll`), exibindo apenas a GUI.
* **Integração:** Carrega o módulo principal `MainGUI.ps1`.

---

## 🛠️ Detalhes Técnicos

Este projeto foi um exercício de **aprendizado guiado** para aprofundar conhecimentos em:
* **Programação Orientada a Objetos (PS):** Manipulação de elementos do Windows Forms.
* **Assincronismo:** Uso de `Start-Job` e `Timer` para coleta de dados sem travar a interface.
* **Customização:** Funções modulares (`Add-Launcher`, `Add-WingetApp`) que facilitam a expansão do painel.

---

## 📜 Licença

Este projeto está sob a licença **MIT**. Isso significa que você pode usar, copiar, modificar e distribuir o código livremente. Para mais detalhes, consulte o arquivo `LICENSE` no repositório.

---

## 🤝 Inspirações e Créditos
* **WinUtils** (Chris Titus Tech)
* **Windows 10 Debloater** (Sycnex)
* **Sophia Script** (Dmitry)

---
*Desenvolvido com 💙 por [Seu Nome]*
