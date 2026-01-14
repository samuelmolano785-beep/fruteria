import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Legal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <ShieldCheck className="text-green-600" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">Política de Privacidad y Tratamiento de Datos</h2>
      </div>

      <div className="prose text-gray-700">
        <h3 className="text-lg font-bold text-gray-900 mb-2">1. Marco Legal (Colombia)</h3>
        <p className="mb-4">
          En cumplimiento de la <strong>Ley 1581 de 2012</strong> y el Decreto 1377 de 2013, 
          FrutiPOS informa que los datos personales recolectados (como el correo electrónico para el envío de facturas) 
          serán tratados de manera confidencial y segura.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mb-2">2. Finalidad de la Recolección</h3>
        <p className="mb-4">
          Los datos solicitados se utilizarán <strong>exclusivamente</strong> para:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>El envío digital de la factura o recibo de compra.</li>
          <li>Fines contables y tributarios requeridos por la ley.</li>
          <li>No se utilizarán para publicidad ni se venderán a terceros sin autorización expresa.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mb-2">3. Derechos del Titular (Habeas Data)</h3>
        <p className="mb-4">
          Como cliente, usted tiene derecho a:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Conocer, actualizar y rectificar sus datos personales.</li>
          <li>Solicitar la supresión de sus datos cuando no sean necesarios para el cumplimiento legal o contractual.</li>
          <li>Revocar la autorización otorgada.</li>
        </ul>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm mt-6">
          <strong>Nota para el Comerciante:</strong> Este software incluye una casilla de verificación en el punto de venta 
          para obtener la autorización explícita del cliente antes de enviar correos electrónicos, asegurando el cumplimiento de la norma.
        </div>
      </div>
    </div>
  );
};

export default Legal;