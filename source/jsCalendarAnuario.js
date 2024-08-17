var jsCalendarAnuario = (function() {

    // Constructor de la clase jsCalendarAnuario
    function jsCalendarAnuario(containerId, options = {}) {
        this.containerId = containerId;
        this.options = Object.assign({
            year: new Date().getFullYear(), // Año que se mostrará, por defecto el año actual
            monthsPerRow: 3, // Número de meses por fila, por defecto 3
            calendarWidth: 300, // Ancho mínimo de cada calendario en píxeles
            autoResponsive: true // Si debe ajustarse automáticamente a la pantalla
        }, options);

        this.renderCalendars();
        if (this.options.autoResponsive) {
            window.addEventListener('resize', this.renderCalendars.bind(this));
        }
    }

    // Método para renderizar los calendarios
    jsCalendarAnuario.prototype.renderCalendars = function() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found.`);
            return;
        }

        container.innerHTML = ''; // Limpiar el contenedor

        const totalMonths = 12;
        const containerWidth = container.clientWidth;
        const monthsPerRow = this.calculateMonthsPerRow(containerWidth);
        const calendarWidth = Math.max(Math.floor(containerWidth / monthsPerRow) - 20, this.options.calendarWidth);

        container.style.display = "grid";
        container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${calendarWidth}px, 1fr))`;
        container.style.gridGap = "10px";

        for (let i = 0; i < totalMonths; i++) {
            const calendarDiv = document.createElement('div');
            calendarDiv.style.width = `${calendarWidth}px`;
            container.appendChild(calendarDiv);

            const calendar = jsCalendar.new({
                target: calendarDiv,
                date: new Date(this.options.year, i, 1), // Establecer mes y año según la opción proporcionada
                options: {
                    navigator: false, // Desactivar la navegación
                    zeroFill: true, // Rellenar con ceros los días si es necesario
                    dayFormat: 'DD', // Formato de dos dígitos para los días
                    monthFormat: 'MONTH YYYY', // Formato claro para el mes y año
                }
            });

            // Asegurarnos de que se muestren siempre 6 filas, para que todos los días estén visibles
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

    // Método para calcular el número de meses por fila
    jsCalendarAnuario.prototype.calculateMonthsPerRow = function(containerWidth) {
        const calculatedMonthsPerRow = Math.floor(containerWidth / this.options.calendarWidth);
        return Math.max(calculatedMonthsPerRow, 1); // Asegura al menos 1 calendario por fila
    };

    // Retornar la clase para que sea accesible desde fuera
    return jsCalendarAnuario;

})();
