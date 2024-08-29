// Declaración estándar de la función jsCalendarYearMonth
function jsCalendarYearMonth(element, options) {
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
}

// Version
jsCalendarYearMonth.version = 'v1.0.0-beta';

// Prototipo de la función jsCalendarYearMonth
jsCalendarYearMonth.prototype = {
    constructor: jsCalendarYearMonth,

    // Parsear opciones
    _parseOptions: function (options) {
        var defaultOptions = {
            language : 'en',
            zeroFill : false,
            monthFormat : 'month',
            dayFormat : 'D',
            firstDayOfTheWeek : false,
            navigator : false,
            navigatorPosition : 'both',
            min : false,
            max : false,
            onMonthRender : false,
            onDayRender : false,
            onDateRender : false,

            year: new Date().getFullYear(),
            themeClasses: [], // Array de clases de temas
            yearNavigator: true,
            extensions: [],
            selectedDates: [], // Array de fechas seleccionadas
            renderHeader: null, // Función personalizada para renderizar la cabecera
            onPrevYear: null,   // Función personalizada para navegar al año anterior
            onNextYear: null    // Función personalizada para navegar al año siguiente
        };
        return Object.assign({}, defaultOptions, options);
    },

    _render: function () {
        var wrapper = this._container;

        // Vincular el contexto correcto (this) a las funciones de navegación
        var onPrevYear = this._options.onPrevYear ? this._options.onPrevYear.bind(this) : this._prevYear.bind(this);
        var onNextYear = this._options.onNextYear ? this._options.onNextYear.bind(this) : this._nextYear.bind(this);
    
        // Renderizar la cabecera
        var header = this._renderHeader(onPrevYear, onNextYear);

        wrapper.appendChild(header);

        // Crear calendarios mensuales
        for (var i = 0; i < 12; i++) {
            var monthContainer = document.createElement("div");
            // Aplicar las clases de tema especificadas
            this._options.themeClasses.forEach(function (themeClass) {
                monthContainer.classList.add(themeClass);
            });
            wrapper.appendChild(monthContainer);
            
            var calendar = jsCalendar.new(monthContainer, 0, {
                language: this._options.language,
                zeroFill: this._options.zeroFill,
                monthFormat: this._options.monthFormat,
                dayFormat: this._options.dayFormat,
                firstDayOfTheWeek: !this._options.firstDayOfTheWeek ? undefined : this._options.firstDayOfTheWeek,
                navigator: false,
                min: this._options.min,
                max: this._options.max,
                onMonthRender: this._options.onMonthRender,
                onDayRender: this._options.onDayRender,
                onDateRender: this._options.onDateRender
            });
            calendar.goto(new Date(this._year, i, 1));

            this._applyExtensions(calendar);

            this._selectDatesForMonth(calendar, i + 1);

            this._calendars.push(calendar);
        }
    },

    _renderHeader: function(onPrevYear, onNextYear) {
        var header;
    
        if (typeof this._options.renderHeader === 'function') {
            header = this._options.renderHeader(this._year, onPrevYear, onNextYear);
        } else {
            header = document.createElement("div");
            header.className = "year-header";
    
            if (this._options.yearNavigator) {
                var prevNav = document.createElement("div");
                prevNav.className = "jsCalendar-nav-left year-nav-prev";
                prevNav.onclick = onPrevYear;
                header.appendChild(prevNav);
            }
    
            var title = document.createElement("div");
            title.className = "year-title";
            title.textContent = this._year;
            header.appendChild(title);
    
            if (this._options.yearNavigator) {
                var nextNav = document.createElement("div");
                nextNav.className = "jsCalendar-nav-right year-nav-next";
                nextNav.onclick = onNextYear;
                header.appendChild(nextNav);
            }
        }
    
        return header;
    },
    
    updateYear: function(newYear) {
        this._year = newYear;

        var title = this._container.querySelector(".year-title");
        title.textContent = this._year;

        for (var i = 0; i < 12; i++) {
            this._calendars[i].goto(new Date(this._year, i, 1));
            this._selectDatesForMonth(this._calendars[i], i + 1);
        }
    },

    _prevYear: function() {
        this.updateYear(this._year - 1);
    },

    _nextYear: function() {
        this.updateYear(this._year + 1);
    },

    _applyExtensions: function (calendar) {
        if (this._options.extensions && this._options.extensions.length > 0) {
            this._options.extensions.forEach(function(ext) {
                if (typeof jsCalendar.ext === 'function') {
                    var originalUpdate = calendar._events.update;
                    calendar._events.update = function(month) {
                        originalUpdate.call(calendar, month);
                        jsCalendar.ext(ext).update(calendar, month);
                    };
                }
            });
        }
    },

    _selectDatesForMonth: function (calendar, month) {
        var datesToSelect = this._options.selectedDates.filter(function (date) {
            var selectedDate = new Date(date);
            return selectedDate.getFullYear() === this._year && (selectedDate.getMonth() + 1) === month;
        }, this);

        if (datesToSelect.length > 0) {
            var dateObjects = datesToSelect.map(function (date) {
                return new Date(date);
            });
            calendar.select(dateObjects);
        }
    },

    // Método para actualizar las fechas seleccionadas
    updateSelectedDates: function(newSelectedDates) {
        // Actualizar las fechas seleccionadas en las opciones
        this._options.selectedDates = newSelectedDates;

        // Limpiar las fechas seleccionadas actuales en cada calendario
        for (var i = 0; i < 12; i++) {
            /* // Desmarcar cada fecha individualmente
            var selectedDates = this._calendars[i].getSelected();
            selectedDates.forEach(date => this._calendars[i].unselect(date));  */

            // Desmarcar todas las fechas
            this._calendars[i].clearselect();
            // Seleccionar las nuevas fechas
            this._selectDatesForMonth(this._calendars[i], i + 1); 
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

// Añadir la extensión 'custom-weekend-attribute'
jsCalendar.ext('custom-weekend-attribute', {
    update: function(instance, month) {
        for (var i = month.days.length - 1; i >= 0; i--) {
            var dayElement = instance._elements.bodyCols[i];
            if (month.days[i].getDay() === 0 || month.days[i].getDay() === 6) {
                // dayElement.style.backgroundColor = '#ffeb3b'; // Fondo amarillo para fines de semana
                dayElement.classList.add('jsCalendar-weekend-days');
            }
        }
    }
});
