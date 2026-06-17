import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonInput, IonTextarea, IonButton } from '@ionic/react';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formulario de repo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Formulario de repo</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="form-container">
          <IonInput 
            className = "form-field"
            label="Nombre del repositorio"
            labelPlacement="floating"
            placeholder="Ingrese el nombre del repositorio"
          />
          <IonTextarea
            className = "form-field"
            label="Descripcion del repositorio"
            labelPlacement="floating"
            placeholder="Ingrese el descripcion del repositorio"
            rows={6}
          />
          <IonButton
            className = "form-field"
            expand="block"
            shape="round"
            color="primary"
          >
            Guardar
          </IonButton>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
