import CommonFunc from './CommonFunc';
export default class Restoran extends CommonFunc{
  offset;
  limit;
  constructor(){
    super();
    this.offset = 0;
    this.limit = 10;
  }

  loadNextPage = () => {
    return new Promise((resolve,reject)=> {
      this.db.allDocs({
        startkey: 'restoran',
        endkey: 'restoran\ufff0',
        skip: this.offset * this.limit,
        limit: this.limit,
        include_docs: true
      }).then(resp => {
        this.offset++;
        var data = resp.rows.map(el => el.doc);
        return (
          resolve({
            success:true,
            data,
            isEnd: data.length === 0
          })
        )
      }).catch(err => {
        return(
          reject(err)
        )
      })
    });
  }

  resetOffset = ()=> {
    this.offset = 0;
  }

  loadRestoranById = (kodeRestoran) =>{
    return new Promise((resolve,reject)=> {
      this.db.get(kodeRestoran).then(resp => {
        return(
          resolve({
            success:true,
            data: resp
          })
        )
      }).catch(err => {
        if(err.status == 404){
          return(
            resolve({
              success:false,
              info:"Data tidak ditemukan"
            })
          )
        }
        return(
          reject(err)
        )
      })
    })
  }

  simpanRestoran = (kodeRestoran,namaRestoran,hargaRestoran,wilayahRestoran) => {
    return new Promise(async (resolve,reject)=> {
      let doc;
      try{
         doc = await this.db.get(kodeRestoran);
      }catch(err){
        doc = null;
      }
      if(doc !== null){
        this.db.put({
          _id:kodeRestoran,
          _rev: doc._rev,
          namaRestoran:namaRestoran,
          hargaRestoran:hargaRestoran,
          wilayahRestoran:wilayahRestoran
        }).then(()=> {
          return(
            resolve({
              success:true,
              info:"Data berhasil disimpan"
            })
          )
        }).catch(err=>{
          return(
            reject(err)
          )
        })
      }else{
        this.db.put({
          _id:kodeRestoran,
          namaRestoran:namaRestoran,
          hargaRestoran:hargaRestoran,
          wilayahRestoran:wilayahRestoran
        }).then(()=> {
          return(
            resolve({
              success:true,
              info:"Data berhasil disimpan"
            })
          )
        }).catch(err=>{
          return(
            reject(err)
          )
        })
      }
    });
  }
}