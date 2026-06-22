export function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Política de Privacidad</h1>
        <p className="last-updated">Última actualización: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Introducción</h2>
          <p>
            El Guardarropa ("nosotros", "nuestro" o "la Aplicación") se compromete a proteger tu privacidad.
            Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos tu información.
          </p>
        </section>

        <section>
          <h2>2. Información que Recopilamos</h2>
          <p>Recopilamos información que proporcionas directamente:</p>
          <ul>
            <li>Correo electrónico y datos de autenticación</li>
            <li>Fotos de prendas de ropa</li>
            <li>Metadatos de las prendas (categoría, color, material, etc.)</li>
            <li>Información de uso (events analíticos)</li>
          </ul>
        </section>

        <section>
          <h2>3. Uso de la Información</h2>
          <p>Usamos tu información para:</p>
          <ul>
            <li>Proporcionar y mejorar los servicios</li>
            <li>Procesar transacciones de pago</li>
            <li>Enviar notificaciones (si las has habilitado)</li>
            <li>Análisis y mejora de la experiencia</li>
          </ul>
        </section>

        <section>
          <h2>4. Almacenamiento de Datos</h2>
          <p>
            Tus fotos se almacenan en Supabase Storage (servidor en EU).
            Tus datos personales se encriptan en tránsito (HTTPS) y en reposo.
          </p>
        </section>

        <section>
          <h2>5. Derechos GDPR</h2>
          <p>Bajo GDPR tienes derecho a:</p>
          <ul>
            <li>Acceder a tus datos personales</li>
            <li>Rectificar datos inexactos</li>
            <li>Solicitar la eliminación ("derecho al olvido")</li>
            <li>Portabilidad de datos</li>
            <li>Oposición al procesamiento</li>
          </ul>
          <p>
            Contacta a <strong>hola@elguardarropa.com</strong> para ejercer estos derechos.
          </p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            Usamos cookies locales para recordar preferencias (ej: consentimiento GDPR).
            No usamos cookies de terceros para rastreo.
          </p>
        </section>

        <section>
          <h2>7. Contacto</h2>
          <p>
            Para preguntas sobre esta política, contacta a:<br />
            <strong>Email: faustojavierpuentesperezl@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
  )
}
