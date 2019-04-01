import React , { useState, useEffect } from 'react';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Text,
  Icon,
  Button,
  Title
} from 'native-base'
export default function Home(props){


  const renderHeader = ()=> {
    return (
      <Header>
        <Left>
          <Button transparent
            onPress={() => props.navigation.toggleDrawer()}>
              <Icon name="bars" type="FontAwesome" />
          </Button>
        </Left>
        <Body>
          <Title>Home</Title>
        </Body>
        <Right />
      </Header>
    )
  }

  const _home = (
    <Container>
      {renderHeader()}
      <Content contentContainerStyle={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text>Selamat Datang di Aplikasi Makan Mana</Text>
      </Content>
    </Container>
  )

  return _home;

}