/**
 * traido de "year calendar.html", sin extensiones
 */
(function (window, jsCalendar) {
    // Componente jsCalendarYearMonth
    var jsCalendarYearMonth = function (element, options) {
        // Parsear opciones
        this._options = this._parseOptions(options);
        
        // Establecer el año
        this._year = this._options.year || new Date().getFullYear();

        // Crear el contenedor principal
        this._container = element;
        this._container.classList.add('jsCalendar-yearmonth');
        
        // Crear la vista anual
        this._render();
    };

    // Métodos del Componente
    jsCalendarYearMonth.prototype = {
        // Parsear opciones
        _parseOptions: function (options) {
            var defaultOptions = {
                year: new Date().getFullYear(),
                theme: 'clean', // Tema por defecto
                language: 'es', // Idioma por defecto
                zeroFill: true,
                navigator: false,
                extensions: [] // Extensiones adicionales
            };
            return Object.assign({}, defaultOptions, options);
        },

        // Renderizar la vista anual
        _render: function () {
            var wrapper = this._container;

            // Crear título del año
            var title = document.createElement("div");
            title.className = "year-title";
            title.textContent = this._year;
            wrapper.appendChild(title);

            // Crear calendarios mensuales
            var calendars = [];
            for (var i = 0; i < 12; i++) {
                // Crear contenedor para cada mes
                var monthContainer = document.createElement("div");
                monthContainer.className = this._options.theme + "-theme"; // Aplicar tema
                wrapper.appendChild(monthContainer);
                
                // Crear el calendario para el mes específico
                var calendar = jsCalendar.new(monthContainer, 0, {
                    language: this._options.language,
                    zeroFill: this._options.zeroFill,
                    navigator: this._options.navigator
                });
                calendar.goto("01-" + ((i + 1 < 10) ? "0" : "") + (i + 1) + "-" + this._year);

                // Aplicar extensiones si existen
                this._applyExtensions(calendar);

                // Añadir a la lista de calendarios
                calendars.push(calendar);
            }
        },

        // Aplicar extensiones
        _applyExtensions: function (calendar) {
            if (this._options.extensions && this._options.extensions.length > 0) {
                this._options.extensions.forEach(function(ext) {
                    if (typeof jsCalendar.ext === 'function') {
                        jsCalendar.ext(ext);
                    }
                });
            }
        }
    };

    // Añadir el componente a la ventana global
    window.jsCalendarYearMonth = jsCalendarYearMonth;

}(window, jsCalendar));
