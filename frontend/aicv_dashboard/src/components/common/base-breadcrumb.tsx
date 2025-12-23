import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface BaseBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function BaseBreadcrumb({ items }: BaseBreadcrumbProps) {
  const navigate = useNavigate();
  const lastIndex = items.length - 1;

  return (
    <Breadcrumbs
      separator={
        <Typography variant='h3' color='neutral.50'>
          /
        </Typography>
      }
      aria-label='breadcrumb'
    >
      {items.map((item, index) =>
        index === lastIndex ? (
          <Typography key={index} variant='h3' color='neutral.999'>
            {item.title}
          </Typography>
        ) : (
          <Link
            key={index}
            underline='none'
            color='neutral.50'
            sx={{ cursor: 'pointer', typography: 'h3' }}
            onClick={() => item.path && navigate(item.path)}
          >
            {item.title}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
