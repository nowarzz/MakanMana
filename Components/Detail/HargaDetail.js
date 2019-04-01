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
import mHarga from '../Model/Harga';
import moment from 'moment-timezone';
import Reactotron from 'reactotron-react-native';
export default function HargaDetail(props){

  const mWil = new mHarga();
  const inputs = [];
  const [isLoading,setIsLoading] = useState(false);
  const [kodeHarga, setKodeHarga] = useState(null);
  const [namaHarga, setNamaHarga] = useState(null);

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
    const _kodeHarga = params.kodeHarga;
    if (_kodeHarga) {
      mWil.loadHargaById(_kodeHarga).then(resp => {
        Reactotron.log(resp);
        if(resp.success){
          setKodeHarga(_kodeHarga);
          var _namaHarga = resp.data.namaHarga
          setNamaHarga(_namaHarga);
          Reactotron.log(namaHarga);
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
        <Title>Harga Detail</Title>
      </Body>
      <Right />
    </Header>
  )
  
  const simpanHarga = ()=> {
    const {params} = props.navigation.state;
    var _kodeHarga = params.kodeHarga;
    if(!kodeHarga){
      _kodeHarga = `harga-${moment().format("YYYYMMDDHHmmss")}`;
      setKodeHarga(_kodeHarga);
    }
    mWil.simpanHarga(_kodeHarga, namaHarga).then(resp => {
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
            <Label>Kode Harga</Label>
            <Input
              value={kodeHarga}
              editable={false}
              ref={ref=>inputs[0] = ref}
            />
          </Item>
          <Item stackedLabel>
            <Label>Nama Harga</Label>
            <Input
              value={namaHarga}
              ref={ref=>inputs[1] = ref}
              onChangeText={val => setNamaHarga(val)}
            />
          </Item>
          <Button primary style={{marginTop:10,marginLeft:10}} onPress={simpanHarga}>
            <Text>Simpan</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  )

  return _render;
}

HargaDetail.propTypes = {
  navigation: PropTypes.shape({
    state:PropTypes.shape({
      params:PropTypes.shape({
        onBack:PropTypes.func.isRequired,
        kodeHarga:PropTypes.string
      })
    })
  })
}