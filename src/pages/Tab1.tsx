import React from 'react';
import { IonContent, IonHeader, IonList, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { Repository } from '../interfaces/Repository';
import { fetchRepositories } from '../services/GithubService';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab1: React.FC = () => {
  const [repositoryList, setRepositoryList] = React.useState<Repository[]> ([]);
  const [loading, setLoading] = React.useState(false);

  const loadRepos = async () => {
    setLoading(true)
    const reposData = await fetchRepositories();
    setRepositoryList(reposData)
    setLoading(false)

  }

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
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>

        {repositoryList.map((repo) => (
          <RepoItem {...repo} />
        ))}
 

        </IonList>
        {loading && <LoadingSpinner />}
        {!loading && repositoryList.length == 0 &&
        (<IonText color="danger">
          <p>No se pudeo cargar el repo</p>
        </IonText>)
        }

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
