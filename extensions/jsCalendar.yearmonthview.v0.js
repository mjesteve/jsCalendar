(function($) {
    // Verificar si jsCalendar está disponible
    if (!$) throw 'Error: jsCalendar library was not found';

    // Constructor de yearmonthview
    var yearmonthview = function () {
        // No se pasan parámetros
        if (arguments.length === 0) {
            // No hacer nada
            return;
        } else {
            // Construir yearmonthview
            this._construct(arguments);
        }
    };

    // Versión del yearmonthview
    yearmonthview.version = 'v1.0.0';

    // Opciones por defecto
    yearmonthview.options = {
        year: new Date().getFullYear(), // Año que se mostrará
        monthsPerRow: 3, // Número de meses por fila
        calendarWidth: 300, // Ancho mínimo de cada calendario
        autoResponsive: true // Ajuste automático en pantallas pequeñas
    };

    // Constructor
    yearmonthview.prototype._construct = function(args) {
        // Parsear argumentos
        args = this._parseArguments(args);
        // Configurar el contenedor
        this._setTarget(args.target);
        // Parsear opciones
        var options = this._parseOptions(args.options);
        // Renderizar calendarios
        this.renderCalendars();
        // Configurar eventos de redimensionamiento si es auto-responsive
        if (this._options.autoResponsive) {
            window.addEventListener('resize', this.renderCalendars.bind(this));
        }
    };

    // Parsear argumentos
    yearmonthview.prototype._parseArguments = function(args) {
        var obj = { target: null, options: {} };
        if (args.length === 1) {
            if (typeof args[0] === 'string' || args[0] instanceof HTMLElement) {
                obj.target = args[0];
            } else {
                obj.options = args[0];
                if (typeof args[0].target !== 'undefined') {
                    obj.target = args[0].target;
                } else {
                    throw new Error('jsCalendarYearMonthView: No target was given.');
                }
            }
        } else if (args.length >= 2) {
            obj.target = args[0];
            obj.options = args[1];
        }
        return obj;
    };

    // Configurar el contenedor
    yearmonthview.prototype._setTarget = function(element) {
        var target = $.tools.getElement(element);
        if (!target) {
            throw new Error('jsCalendarYearMonthView: Target was not found.');
        } else {
            this._target = target;
        }
    };

    // Parsear opciones
    yearmonthview.prototype._parseOptions = function(doptions) {
        this._options = {};
        for (var item in yearmonthview.options) {
            if (yearmonthview.options.hasOwnProperty(item)) {
                this._options[item] = doptions[item] !== undefined ? doptions[item] : yearmonthview.options[item];
            }
        }
        return this._options;
    };

    // Renderizar los calendarios
    yearmonthview.prototype.renderCalendars = function() {
        const container = document.getElementById(this._target);
        if (!container) {
            console.error(`Container with ID ${this._target} not found.`);
            return;
        }

        container.innerHTML = ''; // Limpiar el contenedor

        const totalMonths = 12;
        const containerWidth = container.clientWidth;
        const monthsPerRow = this.calculateMonthsPerRow(containerWidth);
        const calendarWidth = Math.max(Math.floor(containerWidth / monthsPerRow) - 20, this._options.calendarWidth);

        container.style.display = "grid";
        container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${calendarWidth}px, 1fr))`;
        container.style.gridGap = "10px";

        for (let i = 0; i < totalMonths; i++) {
            const calendarDiv = document.createElement('div');
            calendarDiv.style.width = `${calendarWidth}px`;
            container.appendChild(calendarDiv);

            const calendar = new $.new({
                target: calendarDiv,
                date: new Date(this._options.year, i, 1), // Establecer mes y año
                navigator: false, // Desactivar la navegación
                zeroFill: true, // Rellenar con ceros los días si es necesario
                dayFormat: 'DD', // Formato de dos dígitos para los días
                monthFormat: 'MONTH YYYY' // Formato claro para el mes y año
            });

            const tbody = calendarDiv.querySelector('tbody');
            const rows = tbody.querySelectorAll('tr');
            if (rows.length < 6) {
                for (let j = rows.length; j < 6; j++) {
                    const row = document.createElement('tr');
                    for (let k = 0; k < 7; k++) { // 7 días de la semana
                        const cell = document.createElement('td');
                        row.appendChild(cell);
                    }
                    tbody.appendChild(row);
                }
            }
        }
    };

    // Calcular el número de meses por fila
    yearmonthview.prototype.calculateMonthsPerRow = function(containerWidth) {
        const calculatedMonthsPerRow = Math.floor(containerWidth / this._options.calendarWidth);
        return Math.max(calculatedMonthsPerRow, 1);
    };

    // Extender jsCalendar con la nueva funcionalidad yearmonthview
    $.ext('yearmonthview', yearmonthview);

})(window.jsCalendar);
