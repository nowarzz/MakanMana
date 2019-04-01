import React, {useState} from 'react';
import { FlatList } from 'react-native';
import { Container, Content, Text, ListItem } from "native-base";



export default function SideMenu(props){
  const [version,setVersion] = useState('0.0.0');

  const routes = [{
      "Path": "Home",
      "DisplayName": "Home"
    },
    {
      "Path": "Wilayah",
      "DisplayName": "Wilayah"
    }, {
      "Path": "Harga",
      "DisplayName": "Harga"
    }, {
      "Path": "Restoran",
      "DisplayName": "Restoran"
    }
  ];
  return (
    <Container>
      <Content>
      <FlatList
        data={routes}
        renderItem={({item}) => {
          return (
            <ListItem
              button
              onPress={() => props.navigation.navigate(item.Path)}>
              <Text>{item.DisplayName}</Text>
            </ListItem>
          )
        }}
        keyExtractor={(item,index) => index.toString()}
      />
      <ListItem>
        <Text> Current DB Version: {version}</Text>
      </ListItem>
      </Content>
    </Container>
  );
}