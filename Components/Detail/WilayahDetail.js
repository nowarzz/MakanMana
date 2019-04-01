import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import {
  Content,
  Container,
  Header,
  Title,
  Left,
  Body,
  Right,
  Icon,
  Text,
  Button,
  Spinner,
  Form,
  Item,
  Input,
  Label
} from 'native-base';
import mWilayah from '../Model/Wilayah';
import moment from 'moment-timezone';
import Reactotron from 'reactotron-react-native';
export default function WilayahDetail(props){

  const mWil = new mWilayah();
  const inputs = [];
  const [isLoading,setIsLoading] = useState(false);
  const [kodeWilayah, setKodeWilayah] = useState(null);
  const [namaWilayah, setNamaWilayah] = useState(null);

  useEffect(()=>{
    loadData();
    const didFocusListener = props.navigation.addListener('didFocus',componentFocus);
    return(()=>{
      didFocusListener.remove();
    })
  },[]);

  const loadData = ()=>{
    setIsLoading(true);
    const {params} = props.navigation.state;
    const _kodeWilayah = params.kodeWilayah;
    if (_kodeWilayah) {
      mWil.loadWilayahById(_kodeWilayah).then(resp => {
        Reactotron.log(resp);
        if(resp.success){
          setKodeWilayah(_kodeWilayah);
          var _namaWilayah = resp.data.namaWilayah
          setNamaWilayah(_namaWilayah);
          Reactotron.log(namaWilayah);
        }else{
          Alert.alert("Information",resp.info);
        }
      }).catch(err => {
        Alert.alert("Unexpected Error",`${err.name}: ${err.message}`);
      }).finally(()=>{
        setIsLoading(false);
      })
    }else{
      setIsLoading(false);
    }
  }

  const componentFocus = (payload) => {
    loadData();
  }
  
  const goBack = ()=> {
    props.navigation.state.params.onBack();
    props.navigation.goBack();
  }

  const renderHeader = ()=> (
    <Header>
      <Left>
        <Button transparent onPress={goBack}>
          <Icon name="arrow-back" />
          <Text style={{ color: "white" }}> Back</Text>
        </Button>
      </Left>
      <Body>
        <Title>Wilayah Detail</Title>
      </Body>
      <Right />
    </Header>
  )
  
  const simpanWilayah = ()=> {
    const {params} = props.navigation.state;
    var _kodeWilayah = params.kodeWilayah;
    if(!kodeWilayah){
      _kodeWilayah = `wilayah-${moment().format("YYYYMMDDHHmmss")}`;
      setKodeWilayah(_kodeWilayah);
    }
    mWil.simpanWilayah(_kodeWilayah, namaWilayah).then(resp => {
      Alert.alert("Sukses","Data Berhasil Disimpan");
      goBack();
    }).catch(err => {
      Alert.alert("Unexpected Error",`${err.name}: ${err.message}`);
    });
  }


  if(isLoading) {
    return(
      <Container>
        {renderHeader()}
        <Content>
          <Spinner/>
        </Content>
      </Container>
    )
  }


  const _render = (
    <Container>
      {renderHeader()}
      <Content>
        <Form>
          <Item stackedLabel>
            <Label>Kode Wilayah</Label>
            <Input
              value={kodeWilayah}
              editable={false}
              ref={ref=>inputs[0] = ref}
            />
          </Item>
          <Item stackedLabel>
            <Label>Nama Wilayah</Label>
            <Input
              value={namaWilayah}
              ref={ref=>inputs[1] = ref}
              onChangeText={val => setNamaWilayah(val)}
            />
          </Item>
          <Button primary style={{marginTop:10,marginLeft:10}} onPress={simpanWilayah}>
            <Text>Simpan</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  )

  return _render;
}

WilayahDetail.propTypes = {
  navigation: PropTypes.shape({
    state:PropTypes.shape({
      params:PropTypes.shape({
        onBack:PropTypes.func.isRequired,
        kodeWilayah:PropTypes.string
      })
    })
  })
}