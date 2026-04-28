import commonEn from '@/i18n/locales/en-US/common.json'
import navigationEn from '@/i18n/locales/en-US/navigation.json'
import authEn from '@/i18n/locales/en-US/auth.json'
import settingsEn from '@/i18n/locales/en-US/settings.json'
import errorsEn from '@/i18n/locales/en-US/errors.json'
import dashboardEn from '@/i18n/locales/en-US/dashboard.json'
import employeesEn from '@/i18n/locales/en-US/employees.json'
import actionsEn from '@/i18n/locales/en-US/actions.json'
import adminEn from '@/i18n/locales/en-US/admin.json'
import assessmentsEn from '@/i18n/locales/en-US/assessments.json'
import commonEs from '@/i18n/locales/es-MX/common.json'
import navigationEs from '@/i18n/locales/es-MX/navigation.json'
import authEs from '@/i18n/locales/es-MX/auth.json'
import settingsEs from '@/i18n/locales/es-MX/settings.json'
import errorsEs from '@/i18n/locales/es-MX/errors.json'
import dashboardEs from '@/i18n/locales/es-MX/dashboard.json'
import employeesEs from '@/i18n/locales/es-MX/employees.json'
import actionsEs from '@/i18n/locales/es-MX/actions.json'
import adminEs from '@/i18n/locales/es-MX/admin.json'
import assessmentsEs from '@/i18n/locales/es-MX/assessments.json'
import commonFr from '@/i18n/locales/fr-FR/common.json'
import navigationFr from '@/i18n/locales/fr-FR/navigation.json'
import authFr from '@/i18n/locales/fr-FR/auth.json'
import settingsFr from '@/i18n/locales/fr-FR/settings.json'
import errorsFr from '@/i18n/locales/fr-FR/errors.json'
import dashboardFr from '@/i18n/locales/fr-FR/dashboard.json'
import employeesFr from '@/i18n/locales/fr-FR/employees.json'
import actionsFr from '@/i18n/locales/fr-FR/actions.json'
import adminFr from '@/i18n/locales/fr-FR/admin.json'
import assessmentsFr from '@/i18n/locales/fr-FR/assessments.json'
import commonHi from '@/i18n/locales/hi-IN/common.json'
import navigationHi from '@/i18n/locales/hi-IN/navigation.json'
import authHi from '@/i18n/locales/hi-IN/auth.json'
import settingsHi from '@/i18n/locales/hi-IN/settings.json'
import errorsHi from '@/i18n/locales/hi-IN/errors.json'
import dashboardHi from '@/i18n/locales/hi-IN/dashboard.json'
import employeesHi from '@/i18n/locales/hi-IN/employees.json'
import actionsHi from '@/i18n/locales/hi-IN/actions.json'
import adminHi from '@/i18n/locales/hi-IN/admin.json'
import assessmentsHi from '@/i18n/locales/hi-IN/assessments.json'

export const HR_LOCALE_STORAGE_KEY = 'hr_locale'
export const DEFAULT_LANGUAGE = 'en-US'
export const DEFAULT_NAMESPACE = 'common'

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English (United States)', flag: '🇺🇸', dir: 'ltr' as const },
  { code: 'es-MX', label: 'Español (México)', flag: '🇲🇽', dir: 'ltr' as const },
  { code: 'hi-IN', label: 'हिंदी (भारत)', flag: '🇮🇳', dir: 'ltr' as const },
  { code: 'fr-FR', label: 'Français (France)', flag: '🇫🇷', dir: 'ltr' as const },
] as const

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

type BundleValue = Record<string, unknown>

function mergeBundle(base: BundleValue, extra: BundleValue): BundleValue {
  const merged: BundleValue = { ...base }

  for (const [key, value] of Object.entries(extra)) {
    const existing = merged[key]

    if (
      value != null
      && typeof value === 'object'
      && !Array.isArray(value)
      && existing != null
      && typeof existing === 'object'
      && !Array.isArray(existing)
    ) {
      merged[key] = mergeBundle(existing as BundleValue, value as BundleValue)
      continue
    }

    merged[key] = value
  }

  return merged
}

const commonExtras: Record<SupportedLanguageCode, BundleValue> = {
  'en-US': {
    ui: {
      relatedPages: 'Related pages',
      savedViews: 'Saved Views',
      saveCurrentView: 'Save Current View',
      viewName: 'View name…',
      columns: 'Columns',
      manageColumns: 'Manage Columns',
      export: 'Export',
      search: 'Search…',
      searching: 'Searching…',
      select: 'Select…',
      selectDate: 'Select date',
      currencyAmount: '0.00',
      phoneNumber: '(555) 000-0000',
      searchEmployee: 'Search employee...',
      selectJob: 'Select job...',
      noResults: 'No results',
      noOptions: 'No options',
      noMatchingValues: 'No matching values',
      noSavedViews: 'No saved views yet',
      noEmployeesFound: 'No employees found',
      noActivityYet: 'No activity yet.',
      noEvents: 'No events',
      noDataAvailable: 'No data available',
      rowsPerPage: 'Rows per page',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      selectRows: 'Select rows',
      selectAllRows: 'Select all rows',
      expandRow: 'Expand row',
      dialog: 'Dialog',
      close: 'Close',
      dismiss: 'Dismiss',
      field: 'Field',
      from: 'From',
      to: 'To',
      clear: 'Clear',
      clearAll: 'Clear all',
      addFilter: 'Add filter',
      filters: 'Filters',
      range: 'Range',
      outsideBand: 'Outside band',
      withinBand: 'Within band',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      showChildren: 'Show {{count}}',
      hideChildren: 'Hide {{count}}',
      clearFilterAria: 'Clear {{label}} filter',
      removeFilterAria: 'Remove {{label}} filter',
      searchFilter: 'Search {{label}}',
      searchWidgets: 'Search widgets…',
      viewDetails: 'View details',
      all: 'All',
      previewUnavailable: 'Preview unavailable',
      noWidgetsMatchSearch: 'No widgets match your search',
    },
    charts: {
      max: 'Max',
      q3: 'Q3',
      median: 'Median',
      q1: 'Q1',
      min: 'Min',
    },
    organizationPages: {
      jobs: {
        eyebrow: 'Role library',
        subtitle: 'Review the live job catalog and salary ranges.',
        searchPlaceholder: 'Search by job title or ID...',
        filterLabel: 'Job',
        filterSearchPlaceholder: 'Search jobs',
        loadError: 'Failed to load jobs.',
        summaryOverflow: 'Showing first {{limit}} of {{count}} matching jobs',
        summaryDefault: 'Showing {{count}} matching jobs',
        summaryHintOverflow: 'Refine search or filters to narrow the role catalog.',
        summaryHintDefault: 'Adjust search or saved views to focus the role set.',
        emptyTitle: 'No jobs match the current search',
        emptyDescription: 'Adjust the search text to widen the role catalog.',
        tableHeaders: {
          jobId: 'Job ID',
          jobTitle: 'Job Title',
          minSalary: 'Min Salary',
          maxSalary: 'Max Salary',
        },
      },
      locations: {
        eyebrow: 'Office footprint',
        subtitle: 'Review office locations and employee concentration by site.',
        searchPlaceholder: 'Search by city, state, or country...',
        filterLabel: 'Country',
        filterSearchPlaceholder: 'Search countries',
        stateFilterLabel: 'State/Province',
        stateFilterSearchPlaceholder: 'Search states or provinces',
        loadError: 'Failed to load locations.',
        summaryOverflow: 'Showing first {{limit}} of {{count}} matching locations',
        summaryDefault: 'Showing {{count}} matching locations',
        summaryHintOverflow: 'Refine search or filters to narrow the office footprint.',
        summaryHintDefault: 'Use country filters or saved views to focus the office list.',
        emptyTitle: 'No locations match the current search',
        emptyDescription: 'Adjust the search text to widen the office footprint results.',
        tableHeaders: {
          locationId: 'Location ID',
          city: 'City',
          stateProvince: 'State/Province',
          country: 'Country',
          employees: 'Employees',
        },
      },
      countries: {
        eyebrow: 'Geographic footprint',
        subtitle: 'Review the active country footprint and employee concentration by geography.',
        searchPlaceholder: 'Search by country or region...',
        filterLabel: 'Region',
        loadError: 'Failed to load countries.',
        employeeCount_one: '{{count}} employee',
        employeeCount_other: '{{count}} employees',
      },
      departments: {
        eyebrow: 'Organization structure',
        subtitle: 'Review team composition and compare department footprint.',
        searchPlaceholder: 'Search by department or manager...',
        departmentFilterLabel: 'Department',
        departmentFilterSearchPlaceholder: 'Search departments',
        filterLabel: 'Manager',
        filterSearchPlaceholder: 'Search managers',
        loadError: 'Failed to load departments.',
        employeeCount_one: '{{count}} employee',
        employeeCount_other: '{{count}} employees',
        managerPrefix: 'Manager: {{name}}',
      },
      orgChart: {
        eyebrow: 'Hierarchy view',
        subtitle: 'Explore reporting structure visually and move directly into employee detail from the organization hierarchy.',
        loadError: 'Failed to load org chart.',
      },
    },
  },
  'es-MX': {
    ui: {
      relatedPages: 'Páginas relacionadas',
      savedViews: 'Vistas guardadas',
      saveCurrentView: 'Guardar vista actual',
      viewName: 'Nombre de la vista…',
      columns: 'Columnas',
      manageColumns: 'Administrar columnas',
      export: 'Exportar',
      search: 'Buscar…',
      searching: 'Buscando…',
      select: 'Seleccionar…',
      selectDate: 'Seleccionar fecha',
      currencyAmount: '0.00',
      phoneNumber: '(555) 000-0000',
      searchEmployee: 'Buscar empleado...',
      selectJob: 'Seleccione un puesto...',
      noResults: 'Sin resultados',
      noOptions: 'Sin opciones',
      noMatchingValues: 'No hay valores coincidentes',
      noSavedViews: 'Aún no hay vistas guardadas',
      noEmployeesFound: 'No se encontraron empleados',
      noActivityYet: 'Aún no hay actividad.',
      noEvents: 'No hay eventos',
      noDataAvailable: 'No hay datos disponibles',
      rowsPerPage: 'Filas por página',
      previousPage: 'Página anterior',
      nextPage: 'Página siguiente',
      selectRows: 'Seleccionar filas',
      selectAllRows: 'Seleccionar todas las filas',
      expandRow: 'Expandir fila',
      dialog: 'Diálogo',
      close: 'Cerrar',
      dismiss: 'Descartar',
      field: 'Campo',
      from: 'Antes',
      to: 'Después',
      clear: 'Limpiar',
      clearAll: 'Limpiar todo',
      addFilter: 'Agregar filtro',
      filters: 'Filtros',
      range: 'Rango',
      outsideBand: 'Fuera del rango',
      withinBand: 'Dentro del rango',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      showChildren: 'Mostrar {{count}}',
      hideChildren: 'Ocultar {{count}}',
      clearFilterAria: 'Quitar filtro {{label}}',
      removeFilterAria: 'Eliminar filtro {{label}}',
      searchFilter: 'Buscar {{label}}',
      searchWidgets: 'Buscar widgets…',
      viewDetails: 'Ver detalles',
      all: 'Todos',
      previewUnavailable: 'Vista previa no disponible',
      noWidgetsMatchSearch: 'Ningún widget coincide con su búsqueda',
    },
    charts: {
      max: 'Máx.',
      q3: 'Q3',
      median: 'Mediana',
      q1: 'Q1',
      min: 'Mín.',
    },
    organizationPages: {
      jobs: {
        eyebrow: 'Biblioteca de puestos',
        subtitle: 'Revise el catálogo activo de puestos y sus rangos salariales.',
        searchPlaceholder: 'Buscar por puesto o ID...',
        filterLabel: 'Puesto',
        filterSearchPlaceholder: 'Buscar puestos',
        loadError: 'No se pudieron cargar los puestos.',
        summaryOverflow: 'Mostrando los primeros {{limit}} de {{count}} puestos coincidentes',
        summaryDefault: 'Mostrando {{count}} puestos coincidentes',
        summaryHintOverflow: 'Refine la búsqueda o los filtros para acotar el catálogo de puestos.',
        summaryHintDefault: 'Ajuste la búsqueda o las vistas guardadas para enfocar el conjunto de puestos.',
        emptyTitle: 'Ningún puesto coincide con la búsqueda actual',
        emptyDescription: 'Ajuste el texto de búsqueda para ampliar el catálogo de puestos.',
        tableHeaders: {
          jobId: 'ID del puesto',
          jobTitle: 'Puesto',
          minSalary: 'Salario mínimo',
          maxSalary: 'Salario máximo',
        },
      },
      locations: {
        eyebrow: 'Huella de oficinas',
        subtitle: 'Revise las ubicaciones de oficinas y la concentración de empleados por sitio.',
        searchPlaceholder: 'Buscar por ciudad, estado o país...',
        filterLabel: 'País',
        filterSearchPlaceholder: 'Buscar países',
        stateFilterLabel: 'Estado/Provincia',
        stateFilterSearchPlaceholder: 'Buscar estados o provincias',
        loadError: 'No se pudieron cargar las ubicaciones.',
        summaryOverflow: 'Mostrando las primeras {{limit}} de {{count}} ubicaciones coincidentes',
        summaryDefault: 'Mostrando {{count}} ubicaciones coincidentes',
        summaryHintOverflow: 'Refine la búsqueda o los filtros para acotar la huella de oficinas.',
        summaryHintDefault: 'Use filtros por país o vistas guardadas para enfocar la lista de oficinas.',
        emptyTitle: 'Ninguna ubicación coincide con la búsqueda actual',
        emptyDescription: 'Ajuste el texto de búsqueda para ampliar los resultados de oficinas.',
        tableHeaders: {
          locationId: 'ID de ubicación',
          city: 'Ciudad',
          stateProvince: 'Estado/Provincia',
          country: 'País',
          employees: 'Empleados',
        },
      },
      countries: {
        eyebrow: 'Huella geográfica',
        subtitle: 'Revise la huella activa por país y la concentración de empleados por geografía.',
        searchPlaceholder: 'Buscar por país o región...',
        filterLabel: 'Región',
        loadError: 'No se pudieron cargar los países.',
        employeeCount_one: '{{count}} empleado',
        employeeCount_other: '{{count}} empleados',
      },
      departments: {
        eyebrow: 'Estructura organizacional',
        subtitle: 'Revise la composición de equipos y compare la huella de los departamentos.',
        searchPlaceholder: 'Buscar por departamento o gerente...',
        departmentFilterLabel: 'Departamento',
        departmentFilterSearchPlaceholder: 'Buscar departamentos',
        filterLabel: 'Gerente',
        filterSearchPlaceholder: 'Buscar gerentes',
        loadError: 'No se pudieron cargar los departamentos.',
        employeeCount_one: '{{count}} empleado',
        employeeCount_other: '{{count}} empleados',
        managerPrefix: 'Gerente: {{name}}',
      },
      orgChart: {
        eyebrow: 'Vista jerárquica',
        subtitle: 'Explore visualmente la estructura de reportes y navegue directamente al detalle del empleado desde la jerarquía.',
        loadError: 'No se pudo cargar el organigrama.',
      },
    },
  },
  'fr-FR': {
    ui: {
      relatedPages: 'Pages associées',
      savedViews: 'Vues enregistrées',
      saveCurrentView: 'Enregistrer la vue actuelle',
      viewName: 'Nom de la vue…',
      columns: 'Colonnes',
      manageColumns: 'Gérer les colonnes',
      export: 'Exporter',
      search: 'Rechercher…',
      searching: 'Recherche en cours…',
      select: 'Sélectionner…',
      selectDate: 'Sélectionner une date',
      currencyAmount: '0.00',
      phoneNumber: '(555) 000-0000',
      searchEmployee: 'Rechercher un employé...',
      selectJob: 'Sélectionner un poste...',
      noResults: 'Aucun résultat',
      noOptions: 'Aucune option',
      noMatchingValues: 'Aucune valeur correspondante',
      noSavedViews: 'Aucune vue enregistrée pour le moment',
      noEmployeesFound: 'Aucun employé trouvé',
      noActivityYet: 'Aucune activité pour le moment.',
      noEvents: 'Aucun événement',
      noDataAvailable: 'Aucune donnée disponible',
      rowsPerPage: 'Lignes par page',
      previousPage: 'Page précédente',
      nextPage: 'Page suivante',
      selectRows: 'Sélectionner des lignes',
      selectAllRows: 'Sélectionner toutes les lignes',
      expandRow: 'Développer la ligne',
      dialog: 'Boîte de dialogue',
      close: 'Fermer',
      dismiss: 'Ignorer',
      field: 'Champ',
      from: 'De',
      to: 'Vers',
      clear: 'Effacer',
      clearAll: 'Tout effacer',
      addFilter: 'Ajouter un filtre',
      filters: 'Filtres',
      range: 'Plage',
      outsideBand: 'Hors plage',
      withinBand: 'Dans la plage',
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      showChildren: 'Afficher {{count}}',
      hideChildren: 'Masquer {{count}}',
      clearFilterAria: 'Effacer le filtre {{label}}',
      removeFilterAria: 'Supprimer le filtre {{label}}',
      searchFilter: 'Rechercher {{label}}',
      searchWidgets: 'Rechercher des widgets…',
      viewDetails: 'Voir les détails',
      all: 'Tous',
      previewUnavailable: 'Aperçu indisponible',
      noWidgetsMatchSearch: 'Aucun widget ne correspond à votre recherche',
    },
    charts: {
      max: 'Max',
      q3: 'Q3',
      median: 'Médiane',
      q1: 'Q1',
      min: 'Min',
    },
    organizationPages: {
      jobs: {
        eyebrow: 'Bibliothèque des postes',
        subtitle: 'Consultez le catalogue des postes actifs et leurs fourchettes salariales.',
        searchPlaceholder: 'Rechercher par poste ou identifiant...',
        filterLabel: 'Poste',
        filterSearchPlaceholder: 'Rechercher des postes',
        loadError: 'Impossible de charger les postes.',
        summaryOverflow: 'Affichage des {{limit}} premiers postes sur {{count}} correspondants',
        summaryDefault: 'Affichage de {{count}} postes correspondants',
        summaryHintOverflow: 'Affinez la recherche ou les filtres pour réduire le catalogue des postes.',
        summaryHintDefault: 'Ajustez la recherche ou les vues enregistrées pour cibler l’ensemble de postes.',
        emptyTitle: 'Aucun poste ne correspond à la recherche actuelle',
        emptyDescription: 'Ajustez la recherche pour élargir le catalogue des postes.',
        tableHeaders: {
          jobId: 'ID poste',
          jobTitle: 'Intitulé du poste',
          minSalary: 'Salaire min.',
          maxSalary: 'Salaire max.',
        },
      },
      locations: {
        eyebrow: 'Empreinte des sites',
        subtitle: 'Consultez les sites et la concentration des employés par implantation.',
        searchPlaceholder: 'Rechercher par ville, région ou pays...',
        filterLabel: 'Pays',
        filterSearchPlaceholder: 'Rechercher des pays',
        stateFilterLabel: 'État/Province',
        stateFilterSearchPlaceholder: 'Rechercher des états ou provinces',
        loadError: 'Impossible de charger les sites.',
        summaryOverflow: 'Affichage des {{limit}} premiers sites sur {{count}} correspondants',
        summaryDefault: 'Affichage de {{count}} sites correspondants',
        summaryHintOverflow: 'Affinez la recherche ou les filtres pour réduire l’empreinte des sites.',
        summaryHintDefault: 'Utilisez les filtres pays ou les vues enregistrées pour cibler la liste des sites.',
        emptyTitle: 'Aucun site ne correspond à la recherche actuelle',
        emptyDescription: 'Ajustez la recherche pour élargir les résultats des sites.',
        tableHeaders: {
          locationId: 'ID site',
          city: 'Ville',
          stateProvince: 'État/Province',
          country: 'Pays',
          employees: 'Employés',
        },
      },
      countries: {
        eyebrow: 'Empreinte géographique',
        subtitle: 'Consultez l’empreinte pays active et la concentration des employés par zone géographique.',
        searchPlaceholder: 'Rechercher par pays ou région...',
        filterLabel: 'Région',
        loadError: 'Impossible de charger les pays.',
        employeeCount_one: '{{count}} employé',
        employeeCount_other: '{{count}} employés',
      },
      departments: {
        eyebrow: 'Structure organisationnelle',
        subtitle: 'Consultez la composition des équipes et comparez l’empreinte des départements.',
        searchPlaceholder: 'Rechercher par département ou manager...',
        departmentFilterLabel: 'Département',
        departmentFilterSearchPlaceholder: 'Rechercher des départements',
        filterLabel: 'Manager',
        filterSearchPlaceholder: 'Rechercher des managers',
        loadError: 'Impossible de charger les départements.',
        employeeCount_one: '{{count}} employé',
        employeeCount_other: '{{count}} employés',
        managerPrefix: 'Manager : {{name}}',
      },
      orgChart: {
        eyebrow: 'Vue hiérarchique',
        subtitle: 'Explorez visuellement la structure hiérarchique et accédez directement à la fiche employé depuis l’organigramme.',
        loadError: 'Impossible de charger l’organigramme.',
      },
    },
  },
  'hi-IN': {
    ui: {
      relatedPages: 'संबंधित पृष्ठ',
      savedViews: 'सहेजी गई दृश्य',
      saveCurrentView: 'वर्तमान दृश्य सहेजें',
      viewName: 'दृश्य का नाम…',
      columns: 'कॉलम',
      manageColumns: 'कॉलम प्रबंधित करें',
      export: 'निर्यात करें',
      search: 'खोजें…',
      searching: 'खोज की जा रही है…',
      select: 'चुनें…',
      selectDate: 'तिथि चुनें',
      currencyAmount: '0.00',
      phoneNumber: '(555) 000-0000',
      searchEmployee: 'कर्मचारी खोजें...',
      selectJob: 'पद चुनें...',
      noResults: 'कोई परिणाम नहीं',
      noOptions: 'कोई विकल्प नहीं',
      noMatchingValues: 'कोई मेल खाने वाला मान नहीं',
      noSavedViews: 'अभी तक कोई सहेजी गई दृश्य नहीं है',
      noEmployeesFound: 'कोई कर्मचारी नहीं मिला',
      noActivityYet: 'अभी तक कोई गतिविधि नहीं है।',
      noEvents: 'कोई ईवेंट नहीं',
      noDataAvailable: 'कोई डेटा उपलब्ध नहीं है',
      rowsPerPage: 'प्रति पृष्ठ पंक्तियाँ',
      previousPage: 'पिछला पृष्ठ',
      nextPage: 'अगला पृष्ठ',
      selectRows: 'पंक्तियाँ चुनें',
      selectAllRows: 'सभी पंक्तियाँ चुनें',
      expandRow: 'पंक्ति विस्तृत करें',
      dialog: 'संवाद',
      close: 'बंद करें',
      dismiss: 'खारिज करें',
      field: 'फ़ील्ड',
      from: 'से',
      to: 'तक',
      clear: 'साफ़ करें',
      clearAll: 'सभी साफ़ करें',
      addFilter: 'फ़िल्टर जोड़ें',
      filters: 'फ़िल्टर',
      range: 'सीमा',
      outsideBand: 'सीमा से बाहर',
      withinBand: 'सीमा के भीतर',
      month: 'माह',
      week: 'सप्ताह',
      day: 'दिन',
      showChildren: '{{count}} दिखाएँ',
      hideChildren: '{{count}} छिपाएँ',
      clearFilterAria: '{{label}} फ़िल्टर साफ़ करें',
      removeFilterAria: '{{label}} फ़िल्टर हटाएँ',
      searchFilter: '{{label}} खोजें',
      searchWidgets: 'विजेट खोजें…',
      viewDetails: 'विवरण देखें',
      all: 'सभी',
      previewUnavailable: 'पूर्वावलोकन उपलब्ध नहीं है',
      noWidgetsMatchSearch: 'कोई विजेट आपकी खोज से मेल नहीं खाता',
    },
    charts: {
      max: 'अधिकतम',
      q3: 'Q3',
      median: 'मध्यिका',
      q1: 'Q1',
      min: 'न्यूनतम',
    },
    organizationPages: {
      jobs: {
        eyebrow: 'भूमिका लाइब्रेरी',
        subtitle: 'सक्रिय पद कैटलॉग और वेतन सीमाओं की समीक्षा करें।',
        searchPlaceholder: 'पद या आईडी से खोजें...',
        filterLabel: 'पद',
        filterSearchPlaceholder: 'पद खोजें',
        loadError: 'पद लोड नहीं हो सके।',
        summaryOverflow: 'मेल खाते {{count}} पदों में से पहले {{limit}} दिखाए जा रहे हैं',
        summaryDefault: 'मेल खाते {{count}} पद दिखाए जा रहे हैं',
        summaryHintOverflow: 'भूमिका कैटलॉग को सीमित करने के लिए खोज या फ़िल्टर परिष्कृत करें।',
        summaryHintDefault: 'भूमिका सेट पर ध्यान केंद्रित करने के लिए खोज या सहेजी गई दृश्य समायोजित करें।',
        emptyTitle: 'वर्तमान खोज से कोई पद मेल नहीं खाता',
        emptyDescription: 'भूमिका कैटलॉग को विस्तृत करने के लिए खोज पाठ समायोजित करें।',
        tableHeaders: {
          jobId: 'पद आईडी',
          jobTitle: 'पद शीर्षक',
          minSalary: 'न्यूनतम वेतन',
          maxSalary: 'अधिकतम वेतन',
        },
      },
      locations: {
        eyebrow: 'ऑफिस फुटप्रिंट',
        subtitle: 'कार्यालय स्थानों और साइट के अनुसार कर्मचारी घनत्व की समीक्षा करें।',
        searchPlaceholder: 'शहर, राज्य या देश से खोजें...',
        filterLabel: 'देश',
        filterSearchPlaceholder: 'देश खोजें',
        stateFilterLabel: 'राज्य/प्रांत',
        stateFilterSearchPlaceholder: 'राज्य या प्रांत खोजें',
        loadError: 'स्थान लोड नहीं हो सके।',
        summaryOverflow: 'मेल खाते {{count}} स्थानों में से पहले {{limit}} दिखाए जा रहे हैं',
        summaryDefault: 'मेल खाते {{count}} स्थान दिखाए जा रहे हैं',
        summaryHintOverflow: 'ऑफिस फुटप्रिंट को सीमित करने के लिए खोज या फ़िल्टर परिष्कृत करें।',
        summaryHintDefault: 'ऑफिस सूची पर ध्यान केंद्रित करने के लिए देश फ़िल्टर या सहेजी गई दृश्य उपयोग करें।',
        emptyTitle: 'वर्तमान खोज से कोई स्थान मेल नहीं खाता',
        emptyDescription: 'ऑफिस परिणाम विस्तृत करने के लिए खोज पाठ समायोजित करें।',
        tableHeaders: {
          locationId: 'स्थान आईडी',
          city: 'शहर',
          stateProvince: 'राज्य/प्रांत',
          country: 'देश',
          employees: 'कर्मचारी',
        },
      },
      countries: {
        eyebrow: 'भौगोलिक उपस्थिति',
        subtitle: 'सक्रिय देश उपस्थिति और भौगोलिक क्षेत्र के अनुसार कर्मचारी घनत्व की समीक्षा करें।',
        searchPlaceholder: 'देश या क्षेत्र से खोजें...',
        filterLabel: 'क्षेत्र',
        loadError: 'देश लोड नहीं हो सके।',
        employeeCount_one: '{{count}} कर्मचारी',
        employeeCount_other: '{{count}} कर्मचारी',
      },
      departments: {
        eyebrow: 'संगठन संरचना',
        subtitle: 'टीम संरचना की समीक्षा करें और विभागीय उपस्थिति की तुलना करें।',
        searchPlaceholder: 'विभाग या प्रबंधक से खोजें...',
        departmentFilterLabel: 'विभाग',
        departmentFilterSearchPlaceholder: 'विभाग खोजें',
        filterLabel: 'प्रबंधक',
        filterSearchPlaceholder: 'प्रबंधक खोजें',
        loadError: 'विभाग लोड नहीं हो सके।',
        employeeCount_one: '{{count}} कर्मचारी',
        employeeCount_other: '{{count}} कर्मचारी',
        managerPrefix: 'प्रबंधक: {{name}}',
      },
      orgChart: {
        eyebrow: 'पदानुक्रम दृश्य',
        subtitle: 'रिपोर्टिंग संरचना को दृश्य रूप से देखें और संगठन पदानुक्रम से सीधे कर्मचारी विवरण में जाएँ।',
        loadError: 'ऑर्ग चार्ट लोड नहीं हो सका।',
      },
    },
  },
}

const settingsExtras: Record<SupportedLanguageCode, BundleValue> = {
  'en-US': {
    options: {
      timezones: {
        America_Los_Angeles: 'America/Los_Angeles (PST/PDT)',
        America_Chicago: 'America/Chicago (CST/CDT)',
        America_New_York: 'America/New_York (EST/EDT)',
        Europe_London: 'Europe/London (GMT/BST)',
        Asia_Kolkata: 'Asia/Kolkata (IST)',
        Asia_Singapore: 'Asia/Singapore (SGT)',
      },
      dateFormats: {
        medium: 'Mar 30, 2026',
        short: '3/30/26',
        long: 'March 30, 2026',
      },
      currencies: {
        USD: 'USD – US Dollar',
        EUR: 'EUR – Euro',
        GBP: 'GBP – British Pound',
        INR: 'INR – Indian Rupee',
        MXN: 'MXN – Mexican Peso',
      },
    },
  },
  'es-MX': {
    options: {
      timezones: {
        America_Los_Angeles: 'America/Los_Angeles (PST/PDT)',
        America_Chicago: 'America/Chicago (CST/CDT)',
        America_New_York: 'America/New_York (EST/EDT)',
        Europe_London: 'Europe/London (GMT/BST)',
        Asia_Kolkata: 'Asia/Kolkata (IST)',
        Asia_Singapore: 'Asia/Singapore (SGT)',
      },
      dateFormats: {
        medium: '30 mar 2026',
        short: '30/3/26',
        long: '30 de marzo de 2026',
      },
      currencies: {
        USD: 'USD – dólar estadounidense',
        EUR: 'EUR – euro',
        GBP: 'GBP – libra esterlina',
        INR: 'INR – rupia india',
        MXN: 'MXN – peso mexicano',
      },
    },
  },
  'fr-FR': {
    options: {
      timezones: {
        America_Los_Angeles: 'America/Los_Angeles (PST/PDT)',
        America_Chicago: 'America/Chicago (CST/CDT)',
        America_New_York: 'America/New_York (EST/EDT)',
        Europe_London: 'Europe/London (GMT/BST)',
        Asia_Kolkata: 'Asia/Kolkata (IST)',
        Asia_Singapore: 'Asia/Singapore (SGT)',
      },
      dateFormats: {
        medium: '30 mars 2026',
        short: '30/03/26',
        long: '30 mars 2026',
      },
      currencies: {
        USD: 'USD – dollar américain',
        EUR: 'EUR – euro',
        GBP: 'GBP – livre sterling',
        INR: 'INR – roupie indienne',
        MXN: 'MXN – peso mexicain',
      },
    },
  },
  'hi-IN': {
    options: {
      timezones: {
        America_Los_Angeles: 'America/Los_Angeles (PST/PDT)',
        America_Chicago: 'America/Chicago (CST/CDT)',
        America_New_York: 'America/New_York (EST/EDT)',
        Europe_London: 'Europe/London (GMT/BST)',
        Asia_Kolkata: 'Asia/Kolkata (IST)',
        Asia_Singapore: 'Asia/Singapore (SGT)',
      },
      dateFormats: {
        medium: '30 मार्च 2026',
        short: '30/3/26',
        long: '30 मार्च 2026',
      },
      currencies: {
        USD: 'USD – अमेरिकी डॉलर',
        EUR: 'EUR – यूरो',
        GBP: 'GBP – ब्रिटिश पाउंड',
        INR: 'INR – भारतीय रुपया',
        MXN: 'MXN – मैक्सिकन पेसो',
      },
    },
  },
}

const actionsExtras: Record<SupportedLanguageCode, BundleValue> = {
  'en-US': {
    hire: {
      placeholders: {
        commissionPct: '0.20',
      },
      hints: {
        commissionPct: 'Enter as decimal: 0.20 = 20%',
      },
      employmentTypeDescriptions: {
        FULL_TIME: 'Standard permanent assignment',
        PART_TIME: 'Reduced schedule employment',
        CONTRACT: 'Time-bound contract arrangement',
        INTERN: 'Learning and development assignment',
      },
      reviewConfirmation: 'By clicking "{{label}}", you confirm all details are accurate. An account will be created for this employee.',
    },
  },
  'es-MX': {
    hire: {
      placeholders: {
        commissionPct: '0.20',
      },
      hints: {
        commissionPct: 'Ingrese como decimal: 0.20 = 20%',
      },
      employmentTypeDescriptions: {
        FULL_TIME: 'Asignación permanente estándar',
        PART_TIME: 'Empleo con jornada reducida',
        CONTRACT: 'Acuerdo por tiempo determinado',
        INTERN: 'Asignación de aprendizaje y desarrollo',
      },
      reviewConfirmation: 'Al hacer clic en "{{label}}", confirma que todos los datos son correctos. Se creará una cuenta para este empleado.',
    },
  },
  'fr-FR': {
    hire: {
      placeholders: {
        commissionPct: '0.20',
      },
      hints: {
        commissionPct: 'Saisissez sous forme décimale : 0.20 = 20 %',
      },
      employmentTypeDescriptions: {
        FULL_TIME: 'Affectation permanente standard',
        PART_TIME: 'Emploi à temps partiel',
        CONTRACT: 'Mission à durée déterminée',
        INTERN: 'Affectation d’apprentissage et de développement',
      },
      reviewConfirmation: 'En cliquant sur "{{label}}", vous confirmez que toutes les informations sont exactes. Un compte sera créé pour cet employé.',
    },
  },
  'hi-IN': {
    hire: {
      placeholders: {
        commissionPct: '0.20',
      },
      hints: {
        commissionPct: 'दशमलव में दर्ज करें: 0.20 = 20%',
      },
      employmentTypeDescriptions: {
        FULL_TIME: 'मानक स्थायी नियुक्ति',
        PART_TIME: 'कम समय-सारिणी वाला रोजगार',
        CONTRACT: 'समय-सीमित अनुबंध व्यवस्था',
        INTERN: 'सीखने और विकास की नियुक्ति',
      },
      reviewConfirmation: '"{{label}}" पर क्लिक करके आप पुष्टि करते हैं कि सभी विवरण सही हैं। इस कर्मचारी के लिए एक खाता बनाया जाएगा।',
    },
  },
}

const dashboardExtras: Record<SupportedLanguageCode, BundleValue> = {
  'en-US': {
    activityTypes: {
      HIRE: 'Hire',
      PROMOTE: 'Promote',
      TRANSFER: 'Transfer',
      TERMINATE: 'Terminate',
      SYSTEM: 'System',
    },
  },
  'es-MX': {
    activityTypes: {
      HIRE: 'Alta',
      PROMOTE: 'Promoción',
      TRANSFER: 'Transferencia',
      TERMINATE: 'Baja',
      SYSTEM: 'Sistema',
    },
  },
  'fr-FR': {
    activityTypes: {
      HIRE: 'Embauche',
      PROMOTE: 'Promotion',
      TRANSFER: 'Transfert',
      TERMINATE: 'Fin',
      SYSTEM: 'Système',
    },
  },
  'hi-IN': {
    activityTypes: {
      HIRE: 'नियुक्ति',
      PROMOTE: 'पदोन्नति',
      TRANSFER: 'स्थानांतरण',
      TERMINATE: 'समाप्ति',
      SYSTEM: 'सिस्टम',
    },
  },
}

const employeesExtras: Record<SupportedLanguageCode, BundleValue> = {
  'en-US': {
    directory: {
      summaryShowingOverflow: 'Showing first {{limit}} of {{count}} matching employees',
      summaryShowingDefault: 'Showing {{count}} matching employees',
      actions: {
        clearSelection: 'Clear selection',
        openFirstSelected: 'Open first selected',
      },
    },
  },
  'es-MX': {
    directory: {
      summaryShowingOverflow: 'Mostrando los primeros {{limit}} de {{count}} empleados coincidentes',
      summaryShowingDefault: 'Mostrando {{count}} empleados coincidentes',
      actions: {
        clearSelection: 'Limpiar selección',
        openFirstSelected: 'Abrir el primero seleccionado',
      },
    },
  },
  'fr-FR': {
    directory: {
      summaryShowingOverflow: 'Affichage des {{limit}} premiers employés sur {{count}} correspondants',
      summaryShowingDefault: 'Affichage de {{count}} employés correspondants',
      actions: {
        clearSelection: 'Effacer la sélection',
        openFirstSelected: 'Ouvrir le premier élément sélectionné',
      },
    },
  },
  'hi-IN': {
    directory: {
      summaryShowingOverflow: 'मेल खाते {{count}} कर्मचारियों में से पहले {{limit}} दिखाए जा रहे हैं',
      summaryShowingDefault: 'मेल खाते {{count}} कर्मचारी दिखाए जा रहे हैं',
      actions: {
        clearSelection: 'चयन साफ़ करें',
        openFirstSelected: 'पहला चयनित खोलें',
      },
    },
  },
}

const errorsExtras: Record<SupportedLanguageCode, BundleValue> = {
  'en-US': {
    messages: {
      UNAUTHORIZED: 'Authentication is required to perform this action.',
      CONFLICT: 'The request could not be completed because of a conflict.',
      EMAIL_EXISTS: 'An employee with this email already exists.',
      EMPLOYEE_ALREADY_TERMINATED: 'This employee is already terminated.',
      SALARY_BELOW_MINIMUM: 'Salary is below the allowed range for the selected job.',
      SALARY_ABOVE_MAXIMUM: 'Salary is above the allowed range for the selected job.',
      DUPLICATE_REQUEST: 'This request has already been processed.',
      BUSINESS_RULE_VIOLATION: 'The request violates a business rule.',
    },
    fields: {
      VALIDATION_INVALID_EMAIL: 'Enter a valid email address.',
      VALIDATION_EXACT_LENGTH_2: 'Use exactly 2 characters.',
      VALIDATION_MAX_LENGTH: 'Enter a shorter value.',
    },
  },
  'es-MX': {
    messages: {
      UNAUTHORIZED: 'Se requiere autenticación para realizar esta acción.',
      CONFLICT: 'La solicitud no se pudo completar debido a un conflicto.',
      EMAIL_EXISTS: 'Ya existe un empleado con este correo electrónico.',
      EMPLOYEE_ALREADY_TERMINATED: 'Este empleado ya está dado de baja.',
      SALARY_BELOW_MINIMUM: 'El salario está por debajo del rango permitido para el puesto seleccionado.',
      SALARY_ABOVE_MAXIMUM: 'El salario está por encima del rango permitido para el puesto seleccionado.',
      DUPLICATE_REQUEST: 'Esta solicitud ya se procesó.',
      BUSINESS_RULE_VIOLATION: 'La solicitud infringe una regla de negocio.',
    },
    fields: {
      VALIDATION_INVALID_EMAIL: 'Ingrese un correo electrónico válido.',
      VALIDATION_EXACT_LENGTH_2: 'Use exactamente 2 caracteres.',
      VALIDATION_MAX_LENGTH: 'Ingrese un valor más corto.',
    },
  },
  'fr-FR': {
    messages: {
      UNAUTHORIZED: 'Une authentification est requise pour effectuer cette action.',
      CONFLICT: 'La requête n’a pas pu être traitée en raison d’un conflit.',
      EMAIL_EXISTS: 'Un employé avec cette adresse e-mail existe déjà.',
      EMPLOYEE_ALREADY_TERMINATED: 'Cet employé est déjà résilié.',
      SALARY_BELOW_MINIMUM: 'Le salaire est inférieur à la plage autorisée pour le poste sélectionné.',
      SALARY_ABOVE_MAXIMUM: 'Le salaire est supérieur à la plage autorisée pour le poste sélectionné.',
      DUPLICATE_REQUEST: 'Cette requête a déjà été traitée.',
      BUSINESS_RULE_VIOLATION: 'La requête enfreint une règle métier.',
    },
    fields: {
      VALIDATION_INVALID_EMAIL: 'Saisissez une adresse e-mail valide.',
      VALIDATION_EXACT_LENGTH_2: 'Utilisez exactement 2 caractères.',
      VALIDATION_MAX_LENGTH: 'Saisissez une valeur plus courte.',
    },
  },
  'hi-IN': {
    messages: {
      UNAUTHORIZED: 'यह कार्रवाई करने के लिए प्रमाणीकरण आवश्यक है।',
      CONFLICT: 'विरोध के कारण अनुरोध पूरा नहीं किया जा सका।',
      EMAIL_EXISTS: 'इस ईमेल वाला कर्मचारी पहले से मौजूद है।',
      EMPLOYEE_ALREADY_TERMINATED: 'यह कर्मचारी पहले से समाप्त है।',
      SALARY_BELOW_MINIMUM: 'वेतन चुने गए पद के अनुमत दायरे से कम है।',
      SALARY_ABOVE_MAXIMUM: 'वेतन चुने गए पद के अनुमत दायरे से अधिक है।',
      DUPLICATE_REQUEST: 'यह अनुरोध पहले ही संसाधित किया जा चुका है।',
      BUSINESS_RULE_VIOLATION: 'यह अनुरोध एक व्यावसायिक नियम का उल्लंघन करता है।',
    },
    fields: {
      VALIDATION_INVALID_EMAIL: 'मान्य ईमेल पता दर्ज करें।',
      VALIDATION_EXACT_LENGTH_2: 'ठीक 2 अक्षर दर्ज करें।',
      VALIDATION_MAX_LENGTH: 'कृपया छोटा मान दर्ज करें।',
    },
  },
}

export const resources = {
  'en-US': {
    common: mergeBundle(commonEn as BundleValue, commonExtras['en-US']),
    navigation: navigationEn,
    auth: authEn,
    settings: mergeBundle(settingsEn as BundleValue, settingsExtras['en-US']),
    errors: mergeBundle(errorsEn as BundleValue, errorsExtras['en-US']),
    dashboard: mergeBundle(dashboardEn as BundleValue, dashboardExtras['en-US']),
    employees: mergeBundle(employeesEn as BundleValue, employeesExtras['en-US']),
    actions: mergeBundle(actionsEn as BundleValue, actionsExtras['en-US']),
    admin: adminEn,
    assessments: assessmentsEn,
  },
  'es-MX': {
    common: mergeBundle(commonEs as BundleValue, commonExtras['es-MX']),
    navigation: navigationEs,
    auth: authEs,
    settings: mergeBundle(settingsEs as BundleValue, settingsExtras['es-MX']),
    errors: mergeBundle(errorsEs as BundleValue, errorsExtras['es-MX']),
    dashboard: mergeBundle(dashboardEs as BundleValue, dashboardExtras['es-MX']),
    employees: mergeBundle(employeesEs as BundleValue, employeesExtras['es-MX']),
    actions: mergeBundle(actionsEs as BundleValue, actionsExtras['es-MX']),
    admin: adminEs,
    assessments: assessmentsEs,
  },
  'fr-FR': {
    common: mergeBundle(commonFr as BundleValue, commonExtras['fr-FR']),
    navigation: navigationFr,
    auth: authFr,
    settings: mergeBundle(settingsFr as BundleValue, settingsExtras['fr-FR']),
    errors: mergeBundle(errorsFr as BundleValue, errorsExtras['fr-FR']),
    dashboard: mergeBundle(dashboardFr as BundleValue, dashboardExtras['fr-FR']),
    employees: mergeBundle(employeesFr as BundleValue, employeesExtras['fr-FR']),
    actions: mergeBundle(actionsFr as BundleValue, actionsExtras['fr-FR']),
    admin: adminFr,
    assessments: assessmentsFr,
  },
  'hi-IN': {
    common: mergeBundle(commonHi as BundleValue, commonExtras['hi-IN']),
    navigation: navigationHi,
    auth: authHi,
    settings: mergeBundle(settingsHi as BundleValue, settingsExtras['hi-IN']),
    errors: mergeBundle(errorsHi as BundleValue, errorsExtras['hi-IN']),
    dashboard: mergeBundle(dashboardHi as BundleValue, dashboardExtras['hi-IN']),
    employees: mergeBundle(employeesHi as BundleValue, employeesExtras['hi-IN']),
    actions: mergeBundle(actionsHi as BundleValue, actionsExtras['hi-IN']),
    admin: adminHi,
    assessments: assessmentsHi,
  },
} as const

export function normalizeSupportedLanguage(input?: string | null): SupportedLanguageCode {
  const raw = input?.trim()
  if (!raw) {
    return DEFAULT_LANGUAGE
  }

  const normalized = raw.replace('_', '-').toLowerCase()
  const exact = SUPPORTED_LANGUAGES.find(language => language.code.toLowerCase() === normalized)
  if (exact) {
    return exact.code
  }

  if (normalized.startsWith('es')) return 'es-MX'
  if (normalized.startsWith('fr')) return 'fr-FR'
  if (normalized.startsWith('hi')) return 'hi-IN'
  if (normalized.startsWith('en')) return 'en-US'
  return DEFAULT_LANGUAGE
}

export function getLanguageMeta(language?: string | null) {
  const code = normalizeSupportedLanguage(language)
  return SUPPORTED_LANGUAGES.find(item => item.code === code) ?? SUPPORTED_LANGUAGES[0]
}

export function readStoredLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }
  return normalizeSupportedLanguage(window.localStorage.getItem(HR_LOCALE_STORAGE_KEY))
}

export function detectInitialLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  const stored = window.localStorage.getItem(HR_LOCALE_STORAGE_KEY)
  if (stored) {
    return normalizeSupportedLanguage(stored)
  }

  return normalizeSupportedLanguage(window.navigator.language)
}

export function persistLanguage(language: string) {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(HR_LOCALE_STORAGE_KEY, normalizeSupportedLanguage(language))
}
