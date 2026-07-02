import React from 'react';
import { IonContent, IonHeader, IonList, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter, useIonAlert} from '@ionic/react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { Repository } from '../interfaces/Repository';
import { fetchRepositories, deleteRepository } from '../services/GithubService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useHistory } from 'react-router';

const Tab1: React.FC = () => {
  const history = useHistory();
  const [repositoryList, setRepositoryList] = React.useState<Repository[]> ([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("")
  const [presentAlert] = useIonAlert();

  const loadRepos = async () => {
    setLoading(true);
    setErrorMsg("");
    fetchRepositories()
      .then((reposData) => setRepositoryList(reposData))
      .catch((error) => setErrorMsg("Error al cargar repositorio: " + error))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (repo: Repository) => {
    presentAlert({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar ${repo.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            setLoading(true);
            try {
              await deleteRepository(repo.owner.login, repo.name);
              setRepositoryList(repositoryList.filter(r => r.id !== repo.id));
              presentAlert({
                header: 'Éxito',
                message: `${repo.name} fue eliminado.`,
                buttons: ['OK'],
              });
            } catch (error) {
              setErrorMsg((error as Error).message);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    });
  };

  const handleEdit = (repo: Repository) => {
    sessionStorage.setItem('editingRepo', JSON.stringify(repo));
    history.push('/tab2');
  };

  useIonViewWillEnter(() => {
    loadRepos();
  });
  
  return (

    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="Ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {repositoryList.map((repo) => (
            <RepoItem key={repo.id} {...repo} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </IonList>
        {loading && <LoadingSpinner />}
        {errorMsg != "" &&
        (<IonText color="danger">
          <p>{errorMsg}</p>
        </IonText>)
        }

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
