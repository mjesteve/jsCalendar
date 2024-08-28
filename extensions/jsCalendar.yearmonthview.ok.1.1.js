(function($) {
    // Verificar si jsCalendar está disponible
    if (!$) throw 'Error: jsCalendar library was not found';

    // Constructor de YearMonthView
    var YearMonthView = function() {
        // Solo se inicializa si hay argumentos
        if (arguments.length > 0) {
            this._construct(arguments);
        }
    };

    // Versión
    YearMonthView.version = 'v1.0.0';

    // Opciones por defecto
    YearMonthView.options = {
        year: new Date().getFullYear(), // Año que se mostrará
        monthsPerRow: 3, // Número de meses por fila
        calendarWidth: 300, // Ancho mínimo de cada calendario
        autoResponsive: true, // Ajuste automático en pantallas pequeñas
        jsCalendarOptions: {} // Opciones adicionales para jsCalendar
    };

    // Sub-Constructor
    YearMonthView.prototype._construct = function(args) {
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
    YearMonthView.prototype._parseArguments = function(args) {
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
    YearMonthView.prototype._setTarget = function(target) {
        this._target = $.tools.getElement(target);
        if (!this._target) {
            throw new Error('jsCalendarYearMonthView: Target was not found.');
        }
    };

    // Parsear opciones
    YearMonthView.prototype._parseOptions = function(doptions) {
        this._options = {};
        for (var item in YearMonthView.options) {
            if (YearMonthView.options.hasOwnProperty(item)) {
                this._options[item] = doptions[item] !== undefined ? doptions[item] : YearMonthView.options[item];
            }
        }
        // Mezclar las opciones específicas de jsCalendar
        this._options.jsCalendarOptions = Object.assign({}, YearMonthView.options.jsCalendarOptions, doptions.jsCalendarOptions);
        return this._options;
    };

    // Renderizar los calendarios
    YearMonthView.prototype.renderCalendars = function() {
        const container = this._target;
        if (!container) {
            console.error('Container with ID ${this._target} not found.');
            return;
        }

        container.innerHTML = ''; // Limpiar el contenedor

        const totalMonths = 12;
        const containerWidth = container.clientWidth;
        const monthsPerRow = this.calculateMonthsPerRow(containerWidth);
        const calendarWidth = Math.max(Math.floor(containerWidth / monthsPerRow) - 20, this._options.calendarWidth);

        container.className = 'jsCalendar-yearmonthview-container';
        container.style.display = "grid";
        container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${calendarWidth}px, 1fr))`;
        container.style.gridGap = "10px";

        for (let i = 0; i < totalMonths; i++) {

            const calendarDiv = document.createElement('div');
            calendarDiv.style.width = `${calendarWidth}px`;

            // Pasar las opciones de jsCalendar junto con la fecha específica de cada mes
            const calendarOptions = Object.assign({}, this._options.jsCalendarOptions, {
                target: calendarDiv,
                date: new Date(this._options.year, i, 1), // Establecer mes y año
                navigator: false, // Desactivar la navegación si está en las opciones generales
            });
            
            calendarDiv.className = calendarOptions.class;
            container.appendChild(calendarDiv);

            const calendar = new $.new(calendarOptions);

            // Asegurar que se muestren siempre 6 filas, para que todos los días estén visibles
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
    YearMonthView.prototype.calculateMonthsPerRow = function(containerWidth) {
        const calculatedMonthsPerRow = Math.floor(containerWidth / this._options.calendarWidth);
        return Math.max(calculatedMonthsPerRow, 1);
    };

    // Registrar YearMonthView como una extensión de jsCalendar
    $.yearmonthview = function() {
        // Crear nuevo objeto
        var obj = new YearMonthView();
        // Construir yearmonthview
        obj._construct(arguments);
        // Devolver nuevo objeto
        return obj;
    };

    // Registrar YearMonthView en jsCalendar para integración más profunda
    $.ext('YearMonthView', YearMonthView);

})(window.jsCalendar);