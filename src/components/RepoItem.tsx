import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonThumbnail } from '@ionic/react';
import './RepoItem.css'
import React from 'react'
import { language, pencil, trash } from 'ionicons/icons';
import { Repository } from '../interfaces/Repository';

interface RepoItemProps extends Repository {
  onEdit: (repo: Repository) => void;
  onDelete: (repo: Repository) => void;
}

const RepoItem: React.FC<RepoItemProps> = (repository) => {
    return(
         <IonItemSliding>
                  <IonItem>
                    <IonThumbnail slot='start'>
                      <img src={repository.owner.avatar_url} alt={repository.name}/>
                    </IonThumbnail>
                    <IonLabel>
                      <h3>{repository.name}</h3>
                      {repository.description && <p>{repository.description}</p>}
                      {repository.language && (
                        <p>
                          <strong>Language:</strong>
                          {repository.language}
                        </p>
                      )}
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption onClick={() => repository.onEdit(repository)}>
                      <IonIcon icon={pencil} slot='icon-only' />
                    </IonItemOption>
                    <IonItemOption color="danger" onClick={() => repository.onDelete(repository)}>
                      <IonIcon icon={trash} slot='icon-only' />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
        
    )
}

export default RepoItem
