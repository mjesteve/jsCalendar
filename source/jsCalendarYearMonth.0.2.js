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
        
        // Almacenar las instancias de los calendarios
        this._calendars = [];

        // Crear la vista anual
        this._render();
    };

    // Métodos del Componente
    jsCalendarYearMonth.prototype = {
        // Parsear opciones
        _parseOptions: function (options) {
            var defaultOptions = {
                year: new Date().getFullYear(),
                theme: 'clean',
                language: 'es',
                zeroFill: true,
                navigator: false,
                yearNavigator: true,
                extensions: [],
                renderHeader: null, // Función personalizada para renderizar la cabecera
                onPrevYear: null,   // Función personalizada para navegar al año anterior
                onNextYear: null    // Función personalizada para navegar al año siguiente
            };
            return Object.assign({}, defaultOptions, options);
        },

        // Renderizar la vista anual
        _render: function () {
            var wrapper = this._container;

            // Vincular el contexto correcto (this) a las funciones de navegación
            var onPrevYear = this._options.onPrevYear ? this._options.onPrevYear.bind(this) : this._prevYear.bind(this);
            var onNextYear = this._options.onNextYear ? this._options.onNextYear.bind(this) : this._nextYear.bind(this);
        
            // Renderizar la cabecera
            var header = this._renderHeader(onPrevYear, onNextYear);

            // Pasar los métodos de navegación a renderHeader
            /* var header = this._renderHeader(
                this._options.onPrevYear || (() => this.updateYear(this._year - 1)),
                this._options.onNextYear || (() => this.updateYear(this._year + 1))
            ); */

            wrapper.appendChild(header);

            // Crear calendarios mensuales
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

                // Aplicar extensiones a cada calendario
                this._applyExtensions(calendar);

                // Almacenar la instancia del calendario
                this._calendars.push(calendar);
            }
        },
        
        // Método para renderizar la cabecera
        _renderHeader: function(onPrevYear, onNextYear) {
            var header;
        
            // Verificar si hay una función personalizada para renderizar la cabecera
            if (typeof this._options.renderHeader === 'function') {
                header = this._options.renderHeader(this._year, onPrevYear, onNextYear);
            } else {
                // Crear la cabecera por defecto
                header = document.createElement("div");
                header.className = "year-header";
        
                if (this._options.yearNavigator) {
                    var prevNav = document.createElement("div");
                    prevNav.className = "jsCalendar-nav-left year-nav-prev";
                    prevNav.onclick = onPrevYear; // Usar función pasada o por defecto
                    header.appendChild(prevNav);
                }
        
                var title = document.createElement("div");
                title.className = "year-title";
                title.textContent = this._year;
                header.appendChild(title);
        
                if (this._options.yearNavigator) {
                    var nextNav = document.createElement("div");
                    nextNav.className = "jsCalendar-nav-right year-nav-next";
                    nextNav.onclick = onNextYear; // Usar función pasada o por defecto
                    header.appendChild(nextNav);
                }
            }
        
            return header;
        },
        
        // Método para actualizar el año
        updateYear: function(newYear) {
            this._year = newYear;

            // Actualizar el título del año
            //this._container.querySelector(".year-title").textContent = this._year;
            var title = this._container.querySelector(".year-title");
            title.textContent = this._year;

            // Actualizar cada calendario con el nuevo año
            for (var i = 0; i < 12; i++) {
                this._calendars[i].goto("01-" + ((i + 1 < 10) ? "0" : "") + (i + 1) + "-" + this._year);
            }
        },

        // Navegar al año anterior
        _prevYear: function() {
            this.updateYear(this._year - 1);
        },

        // Navegar al año siguiente
        _nextYear: function() {
            this.updateYear(this._year + 1);
        },

        // Aplicar extensiones
        _applyExtensions: function (calendar) {
            if (this._options.extensions && this._options.extensions.length > 0) {
                this._options.extensions.forEach(function(ext) {
                    if (typeof jsCalendar.ext === 'function') {
                        // Sobrescribimos el método update para cada instancia de calendario
                        var originalUpdate = calendar._events.update;
                        calendar._events.update = function(month) {
                            originalUpdate.call(calendar, month);
                            jsCalendar.ext(ext).update(calendar, month);
                        };
                    }
                });
            }
        }
    };

    // Añadir la extensión 'custom-date-attribute'
    jsCalendar.ext('custom-date-attribute', {
        update: function(instance, month) {
            for (var i = month.days.length - 1; i >= 0; i--) {
                var dayElement = instance._elements.bodyCols[i];
                var date = month.days[i];
                dayElement.setAttribute('date', 
                    String(date.getDate()).padStart(2, '0') + '/' +
                    String(date.getMonth() + 1).padStart(2, '0') + '/' +
                    String(date.getFullYear())
                );
            }
        }
    });

    // Añadir la extensión 'custom-weekend-today'
    jsCalendar.ext('custom-weekend-today', {
        update: function(instance, month) {
            for (var i = month.days.length - 1; i >= 0; i--) {
                // Cambia el estilo de las celdas del fin de semana
                var dayElement = instance._elements.bodyCols[i];
                if (month.days[i].getDay() === 0 || month.days[i].getDay() === 6) {
                    dayElement.style.backgroundColor = '#ffeb3b'; // Fondo amarillo para fines de semana
                    dayElement.classList.add('jsCalendar-weekend-days');
                }
            }
        }
    });

    // Añadir el componente a la ventana global
    window.jsCalendarYearMonth = jsCalendarYearMonth;

}(window, jsCalendar));
