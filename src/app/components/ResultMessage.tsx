export default function ResultMessage({expression}: {expression: string}) {
  const message: {
    [key: string]: JSX.Element
  } = {
    angry: (<>Voce está com raiva</>),
    sad: (<>Voce está triste</>),
    happy: (<>Voce está feliz</>),
    neutral: (<>Voce está normal</>),
    surprised:(<>Voce está surpreso</>),
  }

    return (
      <>{message[expression]}</>
    )
  }