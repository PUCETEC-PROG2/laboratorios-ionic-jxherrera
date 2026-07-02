import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonTextarea, IonButton, IonText, useIonViewWillEnter } from '@ionic/react';
import './Tab2.css';
import { useState } from 'react';
import { RepositoryPayload } from '../interfaces/RepositoryPayload';
import { Repository } from '../interfaces/Repository';
import React from 'react';
import { createRepository, updateRepository } from '../services/GithubService';
import { useHistory } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab2: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingRepo, setEditingRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  
  const isEditing = editingRepo !== null;

  useIonViewWillEnter(() => {
    const repoData = sessionStorage.getItem('editingRepo');
    if (repoData) {
      const repo = JSON.parse(repoData);
      setEditingRepo(repo);
      setName(repo.name);
      setDescription(repo.description || '');
      sessionStorage.removeItem('editingRepo');
    } else {
      setEditingRepo(null);
      setName('');
      setDescription('');
    }
  });

  const updateField = (field: string, value: string) => {
    if (field === 'name') {
      setName(value);
    } else if (field === 'description') {
      setDescription(value);
    }
    setErrorMsg('');
    setSuccessMsg('');
  };

  const saveRepo = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (trimmedName === '') {
      setErrorMsg('El nombre del repositorio es obligatorio.');
      setSuccessMsg('');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (isEditing && editingRepo) {
        // Modo edición: usar PATCH
        const updatePayload: any = { name: trimmedName };
        if (trimmedDescription) {
          updatePayload.description = trimmedDescription;
        }
        await updateRepository(editingRepo.owner.login, editingRepo.name, updatePayload);
        setSuccessMsg('Repositorio actualizado correctamente.');
      } else {
        // Modo creación: usar POST
        const createPayload: RepositoryPayload = { name: trimmedName };
        if (trimmedDescription) {
          createPayload.description = trimmedDescription;
        }
        await createRepository(createPayload);
        setSuccessMsg('Repositorio creado correctamente.');
      }
      
      setName('');
      setDescription('');
      setEditingRepo(null);
      await new Promise(resolve => setTimeout(resolve, 1000));
      history.push('/tab1');
    } catch (error) {
      console.error('Error en saveRepo:', error);
      setErrorMsg((error as Error).message || `No se pudo ${isEditing ? 'actualizar' : 'crear'} el repositorio.`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isEditing ? 'Editar repo' : 'Crear repositorio'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{isEditing ? 'Editar repo' : 'Crear repositorio'}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="form-container">
          <IonInput
            className="form-field"
            label="Nombre del repositorio"
            labelPlacement="floating"
            placeholder="Ingrese el nombre del repositorio"
            value={name}
            onIonInput={(e: any) => updateField('name', e.detail.value ?? '')}
          />
          <IonTextarea
            className="form-field"
            label="Descripción del repositorio"
            labelPlacement="floating"
            placeholder="Ingrese la descripción del repositorio"
            value={description}
            onIonInput={(e: any) => updateField('description', e.detail.value ?? '')}
            rows={6}
          />
          {errorMsg !== '' && (
            <IonText color="danger">
              <p>{errorMsg}</p>
            </IonText>
          )}
          {successMsg !== '' && (
            <IonText color="success">
              <p>{successMsg}</p>
            </IonText>
          )}
          <IonButton
            className="form-field"
            expand="block"
            shape="round"
            color="primary"
            onClick={saveRepo}
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Editar repo' : 'Crear repositorio'}
          </IonButton>
        </div>
        {loading && <LoadingSpinner />}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
