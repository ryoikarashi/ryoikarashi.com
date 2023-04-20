import React from 'react';
import { type HTMLElementProps } from '@/components/atoms';

type HeadingProps = HTMLElementProps<HTMLHeadingElement> & {
  title: string;
};

function Heading(props: HeadingProps): JSX.Element {
  return H1(props);
}

function H1({ title, ...rest }: HeadingProps): JSX.Element {
  return <h1 {...rest}>{title}</h1>;
}

function H2({ title, ...rest }: HeadingProps): JSX.Element {
  return <h2 {...rest}>{title}</h2>;
}

function H3({ title, ...rest }: HeadingProps): JSX.Element {
  return <h3 {...rest}>{title}</h3>;
}

function H4({ title, ...rest }: HeadingProps): JSX.Element {
  return <h4 {...rest}>{title}</h4>;
}

function H5({ title, ...rest }: HeadingProps): JSX.Element {
  return <h5 {...rest}>{title}</h5>;
}

function H6({ title, ...rest }: HeadingProps): JSX.Element {
  return <h6 {...rest}>{title}</h6>;
}

Heading.H1 = H1;
Heading.H2 = H2;
Heading.H3 = H3;
Heading.H4 = H4;
Heading.H5 = H5;
Heading.H6 = H6;

export default Heading;
