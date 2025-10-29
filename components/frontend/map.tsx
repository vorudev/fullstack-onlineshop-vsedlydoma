export default function Map() { 
    return ( 
        <div className=" w-full   h-full absolute overflow-hidden">
      <a
        href="https://yandex.by/maps/org/vsyo_dlya_doma/145230844804/?utm_medium=mapframe&utm_source=maps"
        style={{
          color: '#eee',
          fontSize: 12,
          position: 'absolute',
          top: 0,
        }}
      >
        Всё для дома
      </a>
      <a
        href="https://yandex.by/maps/157/minsk/category/plumbing_shop/184107711/?utm_medium=mapframe&utm_source=maps"
        style={{
          color: '#eee',
          fontSize: 12,
          position: 'absolute',
          top: 14,
        }}
      >
        Магазин сантехники в Минске
      </a>
      <a
        href="https://yandex.by/maps/157/minsk/category/hardware_store/184107753/?utm_medium=mapframe&utm_source=maps"
        style={{
          color: '#eee',
          fontSize: 12,
          position: 'absolute',
          top: 28,
        }}
      >
        Строительный магазин в Минске
      </a>
      <iframe
        src="https://yandex.by/map-widget/v1/?ll=27.537917%2C53.872810&mode=poi&poi%5Bpoint%5D=27.536643%2C53.873168&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D145230844804&z=17"
        className="w-full h-full"
        frameBorder="1"
        allowFullScreen
        style={{ position: 'relative' }}
        title="Yandex Map"
      ></iframe>
    </div>
    )
}