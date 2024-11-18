PGDMP      +            
    |            peaktime    15.8 (Debian 15.8-1.pgdg120+1)    16.4 O    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16384    peaktime    DATABASE     s   CREATE DATABASE peaktime WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE peaktime;
                ssafy309    false            �            1255    16526    populate_current_month_dates() 	   PROCEDURE     .  CREATE PROCEDURE public.populate_current_month_dates()
    LANGUAGE plpgsql
    AS $$DECLARE
    start_date DATE;
    end_date DATE;
    day DATE;
BEGIN
    -- 현재 월의 첫 번째 날짜와 마지막 날짜 계산
    start_date := date_trunc('month', CURRENT_DATE)::DATE;
    end_date := (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::DATE;

    -- 현재 월의 모든 날짜를 calendars 테이블에 삽입
    FOR day IN SELECT generate_series(start_date, end_date, interval '1 day') LOOP
        BEGIN
            INSERT INTO calendars (date) VALUES (day)
            ON CONFLICT (date) DO NOTHING;
        EXCEPTION WHEN unique_violation THEN
            -- 중복 날짜가 있을 경우 무시하고 다음 날짜로 진행
            CONTINUE;
        END;
    END LOOP;
END;$$;
 6   DROP PROCEDURE public.populate_current_month_dates();
       public          ssafy309    false            �            1259    17280 	   calendars    TABLE     :   CREATE TABLE public.calendars (
    date date NOT NULL
);
    DROP TABLE public.calendars;
       public         heap    ssafy309    false            �            1259    17286    contents    TABLE     �   CREATE TABLE public.contents (
    is_blocked boolean NOT NULL,
    using_time integer NOT NULL,
    content_id bigint NOT NULL,
    hiking_id bigint NOT NULL,
    type character varying(10) NOT NULL,
    name character varying(255) NOT NULL
);
    DROP TABLE public.contents;
       public         heap    ssafy309    false            �            1259    17285    contents_content_id_seq    SEQUENCE     �   ALTER TABLE public.contents ALTER COLUMN content_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.contents_content_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    216            �            1259    17292    groups    TABLE     �   CREATE TABLE public.groups (
    is_delete boolean NOT NULL,
    group_id bigint NOT NULL,
    preset_id bigint NOT NULL,
    root_user_id bigint NOT NULL,
    title character varying(32) NOT NULL
);
    DROP TABLE public.groups;
       public         heap    ssafy309    false            �            1259    17291    groups_group_id_seq    SEQUENCE     �   ALTER TABLE public.groups ALTER COLUMN group_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.groups_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    218            �            1259    17298    hikings    TABLE       CREATE TABLE public.hikings (
    is_self boolean NOT NULL,
    end_time timestamp(6) without time zone NOT NULL,
    hiking_id bigint NOT NULL,
    real_end_time timestamp(6) without time zone,
    start_time timestamp(6) without time zone NOT NULL,
    user_id bigint NOT NULL
);
    DROP TABLE public.hikings;
       public         heap    ssafy309    false            �            1259    17297    hikings_hiking_id_seq    SEQUENCE     �   ALTER TABLE public.hikings ALTER COLUMN hiking_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.hikings_hiking_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    220            �            1259    17304    memos    TABLE     �   CREATE TABLE public.memos (
    create_at timestamp(6) without time zone NOT NULL,
    memo_id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(20) NOT NULL,
    content text NOT NULL
);
    DROP TABLE public.memos;
       public         heap    ssafy309    false            �            1259    17303    memos_memo_id_seq    SEQUENCE     �   ALTER TABLE public.memos ALTER COLUMN memo_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.memos_memo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    222            �            1259    17312    presets    TABLE     �   CREATE TABLE public.presets (
    preset_id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    block_program_array jsonb NOT NULL,
    block_website_array jsonb NOT NULL
);
    DROP TABLE public.presets;
       public         heap    ssafy309    false            �            1259    17311    presets_preset_id_seq    SEQUENCE     �   ALTER TABLE public.presets ALTER COLUMN preset_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.presets_preset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    224            �            1259    17320 	   schedules    TABLE     �   CREATE TABLE public.schedules (
    attention_time integer NOT NULL,
    day_of_week integer NOT NULL,
    start_time time(6) without time zone NOT NULL,
    schedule_id bigint NOT NULL,
    timer_id bigint NOT NULL
);
    DROP TABLE public.schedules;
       public         heap    ssafy309    false            �            1259    17319    schedules_schedule_id_seq    SEQUENCE     �   ALTER TABLE public.schedules ALTER COLUMN schedule_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.schedules_schedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    226            �            1259    17326 
   statistics    TABLE     4  CREATE TABLE public.statistics (
    total_hiking_time integer,
    total_success_count integer,
    statistic_id bigint NOT NULL,
    total_block_count bigint,
    total_hiking_count bigint,
    user_id bigint NOT NULL,
    most_program_array jsonb,
    most_site_array jsonb,
    start_time_array jsonb
);
    DROP TABLE public.statistics;
       public         heap    ssafy309    false            �            1259    17325    statistics_statistic_id_seq    SEQUENCE     �   ALTER TABLE public.statistics ALTER COLUMN statistic_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.statistics_statistic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    228            �            1259    17336 	   summaries    TABLE     �   CREATE TABLE public.summaries (
    created_at timestamp(6) without time zone NOT NULL,
    summary_id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(20) NOT NULL,
    content text NOT NULL
);
    DROP TABLE public.summaries;
       public         heap    ssafy309    false            �            1259    17335    summaries_summary_id_seq    SEQUENCE     �   ALTER TABLE public.summaries ALTER COLUMN summary_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.summaries_summary_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    230            �            1259    17344    timers    TABLE     �  CREATE TABLE public.timers (
    attention_time integer NOT NULL,
    repeat_day integer NOT NULL,
    group_id bigint NOT NULL,
    start_time timestamp(6) without time zone NOT NULL,
    timer_id bigint NOT NULL,
    CONSTRAINT timers_attention_time_check CHECK ((attention_time <= 240)),
    CONSTRAINT timers_repeat_day_check CHECK (((repeat_day <= 127) AND (repeat_day >= 1)))
);
    DROP TABLE public.timers;
       public         heap    ssafy309    false            �            1259    17343    timers_timer_id_seq    SEQUENCE     �   ALTER TABLE public.timers ALTER COLUMN timer_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.timers_timer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    232            �            1259    17352    users    TABLE     &  CREATE TABLE public.users (
    is_delete boolean NOT NULL,
    is_root boolean NOT NULL,
    user_id bigint NOT NULL,
    user_login_id character varying(15) NOT NULL,
    nickname character varying(20) NOT NULL,
    email character varying(64),
    password character varying(64) NOT NULL
);
    DROP TABLE public.users;
       public         heap    ssafy309    false            �            1259    17362    users_groups    TABLE     �   CREATE TABLE public.users_groups (
    child_user_id bigint NOT NULL,
    group_id bigint NOT NULL,
    user_group_id bigint NOT NULL
);
     DROP TABLE public.users_groups;
       public         heap    ssafy309    false            �            1259    17361    users_groups_user_group_id_seq    SEQUENCE     �   ALTER TABLE public.users_groups ALTER COLUMN user_group_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_groups_user_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    236            �            1259    17351    users_user_id_seq    SEQUENCE     �   ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          ssafy309    false    234            r          0    17280 	   calendars 
   TABLE DATA                 public          ssafy309    false    214   �`       t          0    17286    contents 
   TABLE DATA                 public          ssafy309    false    216   �a       v          0    17292    groups 
   TABLE DATA                 public          ssafy309    false    218   am       x          0    17298    hikings 
   TABLE DATA                 public          ssafy309    false    220   n       z          0    17304    memos 
   TABLE DATA                 public          ssafy309    false    222   �q       |          0    17312    presets 
   TABLE DATA                 public          ssafy309    false    224   }       ~          0    17320 	   schedules 
   TABLE DATA                 public          ssafy309    false    226   ŀ       �          0    17326 
   statistics 
   TABLE DATA                 public          ssafy309    false    228   �       �          0    17336 	   summaries 
   TABLE DATA                 public          ssafy309    false    230   �       �          0    17344    timers 
   TABLE DATA                 public          ssafy309    false    232   n�       �          0    17352    users 
   TABLE DATA                 public          ssafy309    false    234   ;�       �          0    17362    users_groups 
   TABLE DATA                 public          ssafy309    false    236   	�       �           0    0    contents_content_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.contents_content_id_seq', 343, true);
          public          ssafy309    false    215            �           0    0    groups_group_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.groups_group_id_seq', 8, true);
          public          ssafy309    false    217            �           0    0    hikings_hiking_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.hikings_hiking_id_seq', 55, true);
          public          ssafy309    false    219            �           0    0    memos_memo_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.memos_memo_id_seq', 9, true);
          public          ssafy309    false    221            �           0    0    presets_preset_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.presets_preset_id_seq', 15, true);
          public          ssafy309    false    223            �           0    0    schedules_schedule_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.schedules_schedule_id_seq', 49, true);
          public          ssafy309    false    225            �           0    0    statistics_statistic_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.statistics_statistic_id_seq', 17, true);
          public          ssafy309    false    227            �           0    0    summaries_summary_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.summaries_summary_id_seq', 4, true);
          public          ssafy309    false    229            �           0    0    timers_timer_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.timers_timer_id_seq', 12, true);
          public          ssafy309    false    231            �           0    0    users_groups_user_group_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.users_groups_user_group_id_seq', 14, true);
          public          ssafy309    false    235            �           0    0    users_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_user_id_seq', 17, true);
          public          ssafy309    false    233            �           2606    17284    calendars calendars_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT calendars_pkey PRIMARY KEY (date);
 B   ALTER TABLE ONLY public.calendars DROP CONSTRAINT calendars_pkey;
       public            ssafy309    false    214            �           2606    17290    contents contents_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (content_id);
 @   ALTER TABLE ONLY public.contents DROP CONSTRAINT contents_pkey;
       public            ssafy309    false    216            �           2606    17296    groups groups_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_id);
 <   ALTER TABLE ONLY public.groups DROP CONSTRAINT groups_pkey;
       public            ssafy309    false    218            �           2606    17302    hikings hikings_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.hikings
    ADD CONSTRAINT hikings_pkey PRIMARY KEY (hiking_id);
 >   ALTER TABLE ONLY public.hikings DROP CONSTRAINT hikings_pkey;
       public            ssafy309    false    220            �           2606    17310    memos memos_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.memos
    ADD CONSTRAINT memos_pkey PRIMARY KEY (memo_id);
 :   ALTER TABLE ONLY public.memos DROP CONSTRAINT memos_pkey;
       public            ssafy309    false    222            �           2606    17318    presets presets_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.presets
    ADD CONSTRAINT presets_pkey PRIMARY KEY (preset_id);
 >   ALTER TABLE ONLY public.presets DROP CONSTRAINT presets_pkey;
       public            ssafy309    false    224            �           2606    17324    schedules schedules_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (schedule_id);
 B   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedules_pkey;
       public            ssafy309    false    226            �           2606    17332    statistics statistics_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (statistic_id);
 D   ALTER TABLE ONLY public.statistics DROP CONSTRAINT statistics_pkey;
       public            ssafy309    false    228            �           2606    17334 !   statistics statistics_user_id_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_user_id_key UNIQUE (user_id);
 K   ALTER TABLE ONLY public.statistics DROP CONSTRAINT statistics_user_id_key;
       public            ssafy309    false    228            �           2606    17342    summaries summaries_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.summaries
    ADD CONSTRAINT summaries_pkey PRIMARY KEY (summary_id);
 B   ALTER TABLE ONLY public.summaries DROP CONSTRAINT summaries_pkey;
       public            ssafy309    false    230            �           2606    17350    timers timers_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.timers
    ADD CONSTRAINT timers_pkey PRIMARY KEY (timer_id);
 <   ALTER TABLE ONLY public.timers DROP CONSTRAINT timers_pkey;
       public            ssafy309    false    232            �           2606    17360    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            ssafy309    false    234            �           2606    17368 +   users_groups users_groups_child_user_id_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.users_groups
    ADD CONSTRAINT users_groups_child_user_id_key UNIQUE (child_user_id);
 U   ALTER TABLE ONLY public.users_groups DROP CONSTRAINT users_groups_child_user_id_key;
       public            ssafy309    false    236            �           2606    17366    users_groups users_groups_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.users_groups
    ADD CONSTRAINT users_groups_pkey PRIMARY KEY (user_group_id);
 H   ALTER TABLE ONLY public.users_groups DROP CONSTRAINT users_groups_pkey;
       public            ssafy309    false    236            �           2606    17356    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            ssafy309    false    234            �           2606    17358    users users_user_login_id_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_login_id_key UNIQUE (user_login_id);
 G   ALTER TABLE ONLY public.users DROP CONSTRAINT users_user_login_id_key;
       public            ssafy309    false    234            �           2606    17379 "   groups fk2y20y08led1rjxmh6w5i2q5lc    FK CONSTRAINT     �   ALTER TABLE ONLY public.groups
    ADD CONSTRAINT fk2y20y08led1rjxmh6w5i2q5lc FOREIGN KEY (root_user_id) REFERENCES public.users(user_id);
 L   ALTER TABLE ONLY public.groups DROP CONSTRAINT fk2y20y08led1rjxmh6w5i2q5lc;
       public          ssafy309    false    218    234    3281            �           2606    17399 %   schedules fk42tmtnthv05uxqg324a6rmf80    FK CONSTRAINT     �   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT fk42tmtnthv05uxqg324a6rmf80 FOREIGN KEY (timer_id) REFERENCES public.timers(timer_id);
 O   ALTER TABLE ONLY public.schedules DROP CONSTRAINT fk42tmtnthv05uxqg324a6rmf80;
       public          ssafy309    false    3277    226    232            �           2606    17414 "   timers fk4r7xvyxydfqj6frvbmdpigwtg    FK CONSTRAINT     �   ALTER TABLE ONLY public.timers
    ADD CONSTRAINT fk4r7xvyxydfqj6frvbmdpigwtg FOREIGN KEY (group_id) REFERENCES public.groups(group_id);
 L   ALTER TABLE ONLY public.timers DROP CONSTRAINT fk4r7xvyxydfqj6frvbmdpigwtg;
       public          ssafy309    false    232    218    3261            �           2606    17374 "   groups fk9hfxiqmjfixqxx02lkme5sqgm    FK CONSTRAINT     �   ALTER TABLE ONLY public.groups
    ADD CONSTRAINT fk9hfxiqmjfixqxx02lkme5sqgm FOREIGN KEY (preset_id) REFERENCES public.presets(preset_id);
 L   ALTER TABLE ONLY public.groups DROP CONSTRAINT fk9hfxiqmjfixqxx02lkme5sqgm;
       public          ssafy309    false    3267    218    224            �           2606    17419 (   users_groups fkggimqo8cv8s5p5wcjmlioodyw    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_groups
    ADD CONSTRAINT fkggimqo8cv8s5p5wcjmlioodyw FOREIGN KEY (group_id) REFERENCES public.groups(group_id);
 R   ALTER TABLE ONLY public.users_groups DROP CONSTRAINT fkggimqo8cv8s5p5wcjmlioodyw;
       public          ssafy309    false    3261    218    236            �           2606    17404 &   statistics fkgubpcsln9g1fvbi3f5sgt5def    FK CONSTRAINT     �   ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT fkgubpcsln9g1fvbi3f5sgt5def FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 P   ALTER TABLE ONLY public.statistics DROP CONSTRAINT fkgubpcsln9g1fvbi3f5sgt5def;
       public          ssafy309    false    228    234    3281            �           2606    17384 #   hikings fkjegk2cp4ib2ecgdxu4qnpqelw    FK CONSTRAINT     �   ALTER TABLE ONLY public.hikings
    ADD CONSTRAINT fkjegk2cp4ib2ecgdxu4qnpqelw FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 M   ALTER TABLE ONLY public.hikings DROP CONSTRAINT fkjegk2cp4ib2ecgdxu4qnpqelw;
       public          ssafy309    false    3281    220    234            �           2606    17389 !   memos fkjfl1v48y7d1vlk2jw1qqm3x42    FK CONSTRAINT     �   ALTER TABLE ONLY public.memos
    ADD CONSTRAINT fkjfl1v48y7d1vlk2jw1qqm3x42 FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 K   ALTER TABLE ONLY public.memos DROP CONSTRAINT fkjfl1v48y7d1vlk2jw1qqm3x42;
       public          ssafy309    false    222    3281    234            �           2606    17394 #   presets fko7rtdgfkre0cvgdrlla4oo2ef    FK CONSTRAINT     �   ALTER TABLE ONLY public.presets
    ADD CONSTRAINT fko7rtdgfkre0cvgdrlla4oo2ef FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 M   ALTER TABLE ONLY public.presets DROP CONSTRAINT fko7rtdgfkre0cvgdrlla4oo2ef;
       public          ssafy309    false    3281    234    224            �           2606    17369 $   contents fkoa7yrw5dk38mcwqrx7j4oqvmg    FK CONSTRAINT     �   ALTER TABLE ONLY public.contents
    ADD CONSTRAINT fkoa7yrw5dk38mcwqrx7j4oqvmg FOREIGN KEY (hiking_id) REFERENCES public.hikings(hiking_id);
 N   ALTER TABLE ONLY public.contents DROP CONSTRAINT fkoa7yrw5dk38mcwqrx7j4oqvmg;
       public          ssafy309    false    3263    216    220            �           2606    17409 %   summaries fkpev8ct9p3antqe0gtr9pbpjyd    FK CONSTRAINT     �   ALTER TABLE ONLY public.summaries
    ADD CONSTRAINT fkpev8ct9p3antqe0gtr9pbpjyd FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 O   ALTER TABLE ONLY public.summaries DROP CONSTRAINT fkpev8ct9p3antqe0gtr9pbpjyd;
       public          ssafy309    false    234    230    3281            �           2606    17424 (   users_groups fktny30nagqs6q7v8ubuimyig2n    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_groups
    ADD CONSTRAINT fktny30nagqs6q7v8ubuimyig2n FOREIGN KEY (child_user_id) REFERENCES public.users(user_id);
 R   ALTER TABLE ONLY public.users_groups DROP CONSTRAINT fktny30nagqs6q7v8ubuimyig2n;
       public          ssafy309    false    3281    234    236            r   �   x���;
�@ E�>��.ZD��V)$���1ZADq��;�]��Nj��ԅ�t���^�ǰ������O������U!Q�|��i����T�,�Y�f�v�Q<x �@����<0x`������<0x`��?ȲH��      t   �  x���Ko�����)|��_�i���l��w�Q-s-�E�3���ȱ�nXU��0�����zu��/���ﻛ/��������7�զ=���?������~���/���\��٧C?O]��������ǻ�P���ǿ��×?4~�F��Cײpʍ�s��@�wu�޷�ۗz�j�����t����z���kA���9h����_��������/-��՚M�hsm���-�Ek-��.\cu�k��x�ד�����-UxxY����#`Wo���f�0�~�v@�G��uwh�=�<$]F��-g�p�����///�c�\w5~L�۵�n_s�_��*�u�Jc�����N�Jccca*M����Q���m�$B�7,G�����d�:�/}�����{8@�9��}��W��ȃ�w.��~�|e��꼪T]�)U�����ٞ9.&��3�;�}(�G8ξ'IC��(����˘�P�iǃ�}2^km���z��ܶ�}󌥭�����9s��>�@ss���w���~��i��xZ3`P�4�~���Pqז-h^�7�qcy��F��6$a4Br�Ʀ}��ձ_�͹o;>&MT}LjT|�p�`��%h."�#��#3�,�`Ͷ�2�Im������/SJ�XC�w�������3i�z�cp�X�d���oç�L��o��y�@.^��|��9Sx����@��NFų��^+���w��Sڪ�z��<v�g����Z��H"��R4l8K�
�h��%��4��W'^)��,[����"�����,�`V���x����ȁ"���9S�_�t�~K�k,/�c��	����>@Q���TR��0d<ZV�X�֋�
���b*j9���y�-�y'Dv����41����v�b��������|F8b�$������x6Z�ݎv�j�ݾ]K�;%@�z�ٜ͡6����$����$h�������4ǝ��$E�Hc���`}�c��b"��8{�8ic.1MK�iY_V8�>�.��[(>���y�}���|O�Z��\�}nc�Cٷ�_�8��~W����o�#��Yw�;}�rR	ts� \`��|����N��Q�U̠׵.�'�`y�l��ʦ��N�C�4&r�|�;�?u���ёa(/�'��Ɔ�Z�Τ���'�Hi@Jʱu���D3%ѠU}�Nq�y�=A�U0ARED���v�=)eC�������O�@e�4�)���B3!-�4��5������񵠃y�6Ⱦ;�",��1T��p�4	0����/�Yb1�-h;M�\6�����H��e�� 4��L��gƐ��� 7��M[� {��K��]0���{��]0���R��h�0mT�h���!Q�m m��W�B�B��Lv
O�ta��<���<I�d>�)NnbD&Drwm��t��'�A�BEg �e�e�@r�@����fL~�LK�n�n��Ðv1�A��X��.W'k��o+^�V�{�J�i+f?7��
ڃ��S����1�q5�`>�I5#3��I��Q ��@Ƅ]I��cJ	+�b�yh�fS�+��)�w9Q/�^��Mߵ����LQ��9���Zafc&߮a���q�e=΀6@Ҹ��,(w �. �y�����`,"d�#N-�&�AN����
����.lsNN++��fv
�«y��K�`�h�H�2Sں��\oN����7�>�'��v������I�Pv;�uL������ۆ9�g0I6#

�t�-QWM��h�f�`A"�,��j�T�X�!�,B;�f�T5}�,�U�\� ~ӂ���Bo���33²h���@��ѿ`(��d]�+�{�X�w����X��u��m�>��V����~_1f���&S���?��91{�6ɂ�J�7�°,��hZ�%�R>e_m�m}�`i��7��`�|0a�r?�����oi���/�����X}D3�J�f����dk|�y%�`<l�4��0�!r�9s=#'�t�Ro�m���U��-�!p��T�n4?C��=`������4$����J[���@�P�
��'B�-$�U��îcWI��O��X�ī5�B}�wQ�Au��E�qV[}��W���-�ס9`G'�)�C/�d_�Y���֮3*}�2�O�Hb���&����7ۺ]����J��2eS�4���h��Rv΢%�s��`�m���u���m�x}�K�H	�Uo��& �����bau�W�hi���E[�ɄT�>�@@dߤYR#�n��ܸ�7#h�P����@�D��gQR(H�y@|<?����Ry]�^�"F}#�WB��Zj�'��#Z������ϨYo���K���Ψ©V�.�Ȳ4Bwԋ�o�ѐ':�I,y^��Ps�9*���\ �����Q�.AyrPY��&q�F�}���Q�7�@Z�!S4�`���e%zP�Q�<����}D�/�����*�̘oIb�@� ��h���Ύ�{)�K4���h�%v�.�/RE^=���1U��)�CW4��	���ך�m� ��=�^&�!v$��b/l�-vq��kM��,��z�Ab
�q�7dʞ����kC�,�,��.����p�3D2�1���BB�˛P�*��d�)/��+�a�[�S��%�9~* �Z/���	B"�n��,A���7}�||hROޤEE@�87�PX[�0l �=�������PT���B�@{�S�8��@��QQ����R#�q&��Ö�����&������k�0?�y��a�`��Ѱ�	x�R�0م��r��!UF��]2���4�a���Rz�le7u��c��1<��$u�ނZTi�����p8�D@��%ڀ(x�bI̀����5?__Wth>��V �j!$���F��T�5F$�B� pE��� �M9@r)�ߦ��@�9,�06ٯ��L�������B�|��?vZ�      v   �   x���v
Q���W((M��L�K/�/-(Vs�	uV�HK�)N�Q0�Q0�Q0�QPw26�T״��$V�\����9IZ�u� Z���y���z��ם[�L�C�)%E��0�A��i�Px�}���;I�oJ�~3
�����8�� :�      x   �  x��X�nT1��+�n@*ȉ��bŢ�JU�h���
!J�����G��H���\'~��������py}�n����������?�~{>�����^�����|�E��U��4İҸF؝�B�¸��{��o�.�H�ʿ��F���د,�����Ê��у�V*�#�WJ�Z!+�6Ը���N��v���X��z"%̉1��wWW5�'N�� k$w7��Bq�
l��1�!��U�D)uh�4��	r�� �icƃGc���I�U��
��\l��9vlpfM�er�P�N&)�"!�P!	��3�Z��b]V�jN�Xh��I����c͂%#pv����G�����߾�Q0��T��M̽9
�5h<@s7�a�"�u:�aEM�|�eÚL������6����ss7�6�&9�N�MAs�gaf��Bs<+��}��Q�|�f�$i	=��nN�d��"�c���
�A�� f88t�:y�\ș1	{�	� ��%�9��TL��T`�L��Gs���܂t�M�
��fs�h��;�-կ1x�6��ϣ�Uĥc��E�5{t�0WG�v���k%���1Q��ɥ"�"��-W1�ţm�Q��%`��Ԉ��ۚ9�8�o0HB���-W�z�l�3-���Ԡz���~��ЗL �u�уje�m{Y�O;�m��$���G�M�Wn4�p�q�)5�G;+h����R?gr�#H	��F��rC�����:��^�24:��d�.�1'?Z��9�����*4幌u�����Z<zX�{i* ��ȗ�ԛ+R��Q�c$�=$���a�}%CU�ih���Jz�WMi�)�{��#��{��_}g�UgK��^�u�>ʫE��� y�ێ�onm���ˬ%�	jژ�����#{�/��ì)/_�K����j��u���Ak�hg�̥�����+-@�9�t�(�����<^~�[Y��Q���=���G��zv���n      z   -  x��XQo�~�X��@�")Ŗ�"p�p��A�ϊ|mˢK�i�" %�\Z�k
"��}d�1-Y��$ʥ��S�����fv�x-. 	��vv�of�ݛ�ݺ��mq�ۿ�|��0��g��/������-1��Nd'�d2W2WE6;3���ʤ3W''&�%S"�ٔH��VP����Pe7X���vP��}2��jG6z��Q;�`��v��v�:�ЏӒ�������Un���P����������|;�Z�a,��6������t"�nք���FqdU�/��b��l)�~S��	��VO���v�B���ʫ˓}I뼮r:�D.=���"A��/a �S��'=��ǂ�����?G�_����y���F`�nm�PU=W��B�[�QI]�	����%�x5�G���K�-<8g�2��r~)����� 3yP��v��+��9�|�y*�%x�O'��t�)�!2Ĩ�"�g�r0����+qD����rB�6҉�FFd���B�/*��	Y��yf@���ZF+�Ӿ���N$��O�|ǲ�L�LL�s��S��$���lwTkK���O�T0j������%���u`�\sT�P�Òz]cV���)��(��iUw4/��,	����^%4�e�QUϪpT�c}��^�W�{xU�6ь��" ��'{�^"��C��zX������ސG�r?���QW���>��ُ�H(wW�rIw�����r�	ȼS��遻#���z�ӽF�Չ�vd����7\fϑ@�vB��I'ە[=������؇m򁺔ku �ձ���9H�,�\BCQ�^��m�6��\����jnD�By)��#j�:���7p��ج���.\�0xfb7/Xo�c����2�xU���t��A�u�tR���}4��aY��fƩ+�/����8�����_�"��G��[��#�����]nU�)xh����{:��<-�ƺ���dH(�Ĝ�n�����ܸ-~5WXY�_��/Ӏ"'f3C����Fx�HJ�f�ċ�Y�Nyn����.��a��L!�W�<<�� �X�P{�\���f	/B(�K(�HK�o6C��fY�AhJ��W����n��-x
\&NW�vCB4z�S��%%��H���{ė8��wm�CQj<*>���jr��@��OU~u�L4��9pۗ�U=��e�+!�G4'�`�U���D��""�B|IȚO#�vϓ��_���"����(u�'���jZP��ZF�,��^?A���N��b�wT�Q��wn�&�dn&{5���MO�p˱,L�Ú���a#}x0Hλo������N��^���L�������{��
s<D�"υ��'_.Z�M�i%_ 6��U�0��W�~��Z�)H{��L".�?{�D�o`�r�l]b8���؃��e0�Low̜c��'��B]���!�R/kY<=�0jH��=� a	������W�I��2S��w@ H����p�7|����kS�\HhZ�^��8�p��c��}=��h{�SC�׎S��y��+`+&��_�=��ag(P�kn�wh�,GJ�oka�pJ��u���ބi�y&Ol�P����QW�,����$��}�Qr�R����/i��Qvd+hԨ�ԶϽ�P��f9��/�������Ek~e!�>T��F�	�G�0WC��2D�����V� 4@��̟�g�n��R�P�#�`�+�:���VM���T�PP���~�o\���6�6yj�[}���1V+�wCR)�ΐV�7vC8?R?{a�.@��3*Q1lL��
b� ���Vl�a'+%�*_X�c�UL���^�<Ɍl���6@�I��>;�B[("���F�Os\�,������'�E��Ճ8���3�[5�����M.����ЮC �DB����՞i�\Zk�'%-�~3;�-j���%�ψ+"�}_��R%s%'~-����V�L��i�Xa�@:_���<_h�V�h	3Trk�PZ_wJ�T��!ĵ?���2��$�j�Ǩj�����C��,?#������u���°��kD"<�׹���:Ӕ�k��t�n���� �����M�'��&2ttM�`�-����:݉�9�X�|EU-��,��s�s�{�Zu�-�Ν^%�����*��Y�`���M���Du�|hR���[���֊�gj�'К��BWT���͗�-D��i�Ć���B��a�_�0�L$���AA��Ĩ�K"N���>�y|�s̡l�3b2q��eψ��8������t��T��8}1?fD��}&�ZFs�َ�Sv�B��E]E���ߐZ�w� 1w=��<g,�QJ������DAn�#ٻ|ײ�__\�ںE�X���z�3q�wg���WEq�*,���\���҃k�6����E�*~0�̱n��P���,p�dU�4>�+��ϰC��?e4��
e3�\�=�ƴ�
�3�1+��;U��Z�d�H�u��KsJ�~}��#(`8v"�s#X������[��rKAS�8�o��x�9ʳ�E�5:C��D���sG|��`��r�jT�1h����ܯ�K�1Qk�tpù��a���g�	�ŋ9�{#���p1��hE4��|�>���m�K�AQ�c��oD�,T��͘�����ޏ��������[<Pn���Ũ�\��[�7� ��bN�Ή�x���4��2�e]N�^�5|�U�ik���w�N���+(/�Xd-L���@c��%j	K���@~F�*��)�ugay�3hH�E�9߱4D����.�dNpѹ��#J@t�$=�H��/Va�j9��/Bs��      |   �  x��W�oE��X�R��]�P��B��S���x�;ڙy��Y��'��K�C7B�R 吿(v�fm��:4�r������Ǿ�}�=���ɣ�G���їI�P)XZ��l��Ͽyt��wt��?H�]��=����?�y�����J&����\ȱ���X���O��|"V�:R����K�Љ���l\Ca���b��2}�m�T�1�~J�������ߞ��T�g��/����W��_�^?}'I����e�k��ã�΋׳�����������Lp��C�aÙ�X�Ԃ�!D��'`	��`�h\������4$�B+4X���/y[��� ��Qk�]m��P@�(��!��k8�ю�w�(��G��YS���6�rb���/�7ZO��"ȴS�X6�	JPEcn��p��()r(��
Ϗ�`c����08��֖O�u������>� J��Ч�֦������\�a����|����\�l±�A�0W6:�8�����t�^0�5�1��� (���� ���%��R4�kR���پ�E�L/q_R������%h�\t-��) r=��5�ݩ��	�e�D�&���S�0D��5�%&�o�� �
�_ݍ�F��kP����� �q8�AC�����zi���
t%Qv팮b�;�����T�a��0�r���w�����}��럞���m��_��K����+��[9���o1nώ��g�p*�$�l�
3��f��>���Nq���"ou�:��#�pP��3E���UfQ��O~*�1�x"�M9n��|�=�7�K�ZK�P���}�0�Wa�����P�XDْϝ�;�鶆��A���A��N{���|;�� 8E�E?��w�����U���;�y�����p�����g      ~   ?  x���AK�0��{?En�P�y�&M���
2�M?�s���0��M���у��S��gi�.�v��ߛa��3o������|x9>_Nǳy��}���2t����ʪ��h�k�\�����\	n%{)>|y��]���=�}�#�C�����eE��ͽ%���;���
^I��{�����?�G�}>��|$��/�s~�#M` Ų� "`�/K�ߴ��e�O�)����^d�`�{»�q+?�|
�-�Dz�}yEyޒ^��=xG� ^I����Rnzg��`��V*�l �H{6 �����r!�@Ӽk���      �   �  x���Ao�0����K6)E�lc0;MS��nZ�]��8�+�8ͪ�����M�]�+�����3�������W���f��2�j�h�7�Ϗ�\^{���C3�'����_�J��O<��Z�@���󷍬���Ǐ3��M�w퐭����okeo��(~I��Z5�Z6��X��"/��Jo��v�]P���r�׏ɫZ��T��Nd��V����V�E���IW�������d�r��R؈��������Y����B;���F�Q�����zsFE=*rF�=*vF�ŝQ�zV�\a0���v��8ޯ���#�]<��i7�p�_)�"eԪGJ02��DJ�n
d�����GRt�ui�����Tm�H�hh�� #����Ɩ
�ĘS��i��#2[��TUЌ�$���gː���Y�C� �P��	���� �� ��~����a�0�[���a1����œ��uE      �   Z  x��WQOY~ﯸ��PFj�}2�fc��mZ�}F3ۚ��M�tl(Ј[F;��E6$;��b����{�?�9�ށ�a�� p���|�;�9��Ӌ'�W��O+?��7����H���F2��fIb��_�� �!%���bc���,F����B�qT��I,L�0	������=��V~	yy�����ÞW챣
�L�v�L���,�����J������iW��	�4������
�����Z���\p܆��C؍�F�,=[��}�=vm����r��饃?�6|�1㊖
�Ԍ�8'��J?�p��ٴk�]�&dB0N�V� $��O���e��+"1:����Ec'r���p����;L�}��=t�tx�a��F���u¾X�"�σ@��i����H,�78)�y��L�2�d9��c��xO��M`]g�:3������ءC�B�Xl���Q����F?���#XB[ex����:T��E�}��W;�ڡ�'�k`���8A�&~���E^�B�:^�f�q���y�V���f�{����.�"�م���}����z�>|�Q�Ml*vd�][���F|�AP�AwVm�.��*h3�;�:�v�*���N�u�7AK$"É
�Te�Ӌ�<�ڶ��	��$�k�2�����A��YH���~��T)���{���]Wj,x�𪷈��B�*q/z�̖�i�<�3������JN�X<j�Q�(a`��(A�ށ��#<��ρɻ�A�-�8�o�( �6л�u��<.�k��~x�'-	0�)fj`�hXpZ仏�>%T/�N�ww0�I�rj;2ki#A�C�:k�b��� �6Vý�@�5v�� ]�ب ��=�{P<�Y�n��!�J\��]��ZP�F%<����(
w.,��o��Dl�{�]����D��V(���y-5����2?��N*2 �0�$�f��"U�Մ$	k��jPF�k�c]s�'+��df{}-�f�p�!�Dld
�iD�-�F�$��F-G�x�Y�{�M䈷j�	��q�� ��	�r�U��j&ݭ�
$�
� �PH���_"��&)�1
e+nzE�TΎ^�����Ȉ炨�AN\jF��b�h�J���o�^�b������ai$|�<[�ܪ��	"�n�T��at`�z���ȯ 5�� �h�X�Jք�&C!ߥ�B�6�>�1�O���(6,�8x��?��}�j�i8��ܻ�>�y��= �t�a:�@���@Q�x}#:�}@��9Љ(�P�\�c}��u��b�Qeq6�Sb���0Fg�h}�|�$ߧ7�����7��RQ���v:��m�ǩ/���Dl�r�;0(@w&�3B��љ�Z��c�k�a<���h0�}i�3����u@��Ek�8.�?��|��B+ǝ�� ��I���Q6��iP��
��kW����W������3�P��LC�
&|���6Y�d��g#�tf{z&)�R���zz�����O��3X� ���`݌�.�sX'�,J{��z��2k���/�����!x���nĔ���`�A_*I����𽌄� ~!��8��1�smw�2�8Ԏωh;���d�d5M���u\|Qy����.���Bo�E�y�=�x5_4���{Z޷��e�Z����߱S^e�*V!�Jf6����̯����ku������������YG�3@-��30�.����H�xAmҿ�rX��w�l�@��Etjk}����Uy�r%9t���>	�W3�$�n��5���l�����|�w�&&�?��3� !%�:0����L���S�oS�Uuk)��V��^@UC�g|�	��
HшB����.;n�����ߙL_a�zi�      �   �   x����
�0�}�bv*���L�XW.�(H[� �EAA|������b�Y��;���"]����
��ݱ�Oo��p��v�ܤ�����I�1DH��vFh2���u�ؕt')/I�Pl?~�j��đ}I���9��Clv�~3�בi 5���t�~3�娶��RI�@�� 3��[��j�� ��_ɱ?      �   �  x���K��V �}~�,"M+E�����6�ƀ����� _^�e�J��m�n�*��*�V�dU��H�E��=��8��c!� �O��s'�������Q���gAy
���䕶|��m)xp�-��}pt���;�f^�e� J�1��:������c�}�O��q�\�̼V�eA%sy��.���k�
C�65CMP�t��7��;!�m�K��q�E %�W�n4:�܃�8mh�9pgg6KQ�a���,I�0C��9��d��l���]��n݂�_.|�����ɣͫ�����7/�nN^������'A��O@R�O Ubxl´jt�)�:�(J�	_j�v���#F˄`��۔��Xz^�����W�6?�߼y}�7�fٲ��o"�q�j�@aŴ�%����g�,��D��c-X� _m��7"�"��~���������:t��C��~�KffJ<r���A�G�(*#j<��`͖� ������~|�۔�:�#E����������B�v�fcZV��˩�،��k���kU���2�[+q`Ǎd� a}�2M{�\��ɋ�o�����ߝ=�p�7�/=?���r0�c�ë��̍�5n���īb�-.�J���Y�k�G�lo㊇���긅W������!zY��P��~S�X�Ck+���g�Ī��p*��+�ϻ<~���x�M˘1J��m��U�j���a�d�-�Y+j��J�����8��"W>b�G\�-�θ�M)�Җ�1ܕh�Sm]�&g#:l���G���-�W�ھ��󝾹�7����}4�&$1��`D�ɢ�5����]�;�ʫdښ���!>��G��.��?/n��ؚ5�9�B��qߠ%JD"��Bϥ.:��}?���D3-�M�>�P�j�E{#�"���}�xK��^�}���K%�W�� ��P�V�(��Tʥ��U�-��J��?t7>@i�I .��/�Ϟ�p���?����������P�r�ot�.f�0v@'#&�r%�@�xZY1�dn�W&��,"���l�M6욭6si���3+�݂��S��(��ߤ3}I&�m�ȑg��#�*���e���K�nnd �P켯��k���H���0df�V�W�9a�K��G�JaT��F�UDgT�5��'q�y�������8�g!R�6(J�e1Hե�b��yA	�q=�+;ѽ{���      �   �   x��ѻ
�@��~�bJ� �$�V)$B.��B@0d��wv|����놶�u㍶�|��S�����	����:��Xv<��(Td��*r@�*
@Tr)!�ZE	�FEN��a%B2%�"F2��Hy�?��gI�#�YbJ�����eԸ     