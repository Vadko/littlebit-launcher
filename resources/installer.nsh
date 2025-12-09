; Custom NSIS installer script for Ukrainian localization (Assisted installer)
; Forces Ukrainian as the primary language

; This macro runs before anything else
!macro preInit
  ; Set Ukrainian language early
  StrCpy $LANGUAGE 1058
!macroend

; Custom header - configure MUI
!macro customHeader
  ; Disable language selection dialog - use Ukrainian only
  !ifdef MUI_LANGDLL_ALLLANGUAGES
    !undef MUI_LANGDLL_ALLLANGUAGES
  !endif
!macroend

; This runs at installer initialization
!macro customInit
  ; Force Ukrainian language (LCID 1058)
  StrCpy $LANGUAGE 1058
!macroend

; Override Multi-User page strings (the first "Install for current user / all users" page)
!macro customInstallMode
  ; Ukrainian translations for Multi-User plugin
  !define MULTIUSER_INSTALLMODE_DISPLAYNAME "$(^Name)"

  ; Override the install mode page strings
  !define MUI_PAGE_HEADER_TEXT "Виберіть режим встановлення"
  !define MUI_PAGE_HEADER_SUBTEXT "Виберіть, чи встановлювати $(^Name) для поточного користувача або для всіх користувачів."
  !define MUI_INNERTEXT_INSTALLMODE_TOP "Виберіть, як встановити $(^Name):"
  !define MUI_INNERTEXT_INSTALLMODE_ALLUSERS "Встановити для всіх користувачів"
  !define MUI_INNERTEXT_INSTALLMODE_CURRENTUSER "Встановити тільки для мене"
!macroend

; Custom welcome page finish text (optional)
!macro customWelcomePageOption
  ; Custom welcome page options can be set here
!macroend

; Custom install section - runs during file installation
!macro customInstall
  ; Additional installation steps can be added here
!macroend

; Uninstaller initialization
!macro customUnInit
  ; Force Ukrainian for uninstaller too
  StrCpy $LANGUAGE 1058
!macroend

; Custom uninstall section
!macro customUnInstall
  ; Additional uninstallation steps can be added here
!macroend

; Remove files on uninstall (optional custom cleanup)
!macro customRemoveFiles
  ; Custom file removal logic
!macroend
